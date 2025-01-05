import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Lending,
  Reservation,
  User,
  UserReservation,
  VLendingForSearchUser,
} from 'src/entities';
import { Like, Repository } from 'typeorm';
import {
  GetUserResponseDto,
  GetUsersRequestDto,
  LendingsForSearchUserDto,
  UpdateUsersRequestDto,
  UserReservationsDto,
} from './dto/users.dto';
import { getUserIncludes } from './users.enums';
import { isStringInArrayCaseInsensitive } from 'src/common/utils/utils';
import * as bcrypt from 'bcrypt';
import { UserInclude } from './schema/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Lending)
    private readonly lendingRepository: Repository<Lending>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  /**
   *
   * @param id 유저 id
   * @param includes optional data to include [lendings, reservations]
   * @returns if user found, return GetUserResponseDto, else return null
   */
  async findOne(
    id: number,
    includes: string[],
  ): Promise<GetUserResponseDto | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) return null;
    const { reservations, lendings, ...rest } = user;
    if (!includes) return rest;

    const [vLendings, vReservations] = await Promise.all([
      includes.includes('lendings')
        ? this.findLendingForSearchUser([id])
        : ([] as VLendingForSearchUser[]),
      includes.includes('reservations')
        ? this.findActiveReservations([id])
        : ([] as UserReservation[]),
    ]);

    const result: GetUserResponseDto = { ...rest };

    if (includes.includes(UserInclude.LENDINGS)) {
      const overDueDay = this.getOverDueDay(vLendings);
      result.lendings = vLendings;
      result.overDueDay = overDueDay;
    }

    if (includes.includes(UserInclude.RESERVATIONS)) {
      result.reservations = vReservations;
    }

    return result;
  }

  // private async getLendings(userId: number) {

  // }

  private getOverDueDay(lendings: VLendingForSearchUser[]): number {
    if (!lendings) return 0;
    return lendings.reduce((acc, cur) => (acc += cur.overDueDay), 0);
  }

  async findAll(
    query: GetUsersRequestDto,
  ): Promise<[GetUserResponseDto[], number]> {
    const { search, order, take, include } = query;

    const [users, total] = await this.usersRepository.findAndCount({
      where: search
        ? { nickname: Like(`%${search}%`), email: Like(`%${search}%`) }
        : {},
      take: take,
      skip: query.skip,
      order: { id: order },
    });

    const responseDto = users.map((user) => {
      const { reservations, lendings, ...rest } = user;
      return rest;
    });

    if (!include) {
      return [responseDto, total];
    }

    const userIds = users.map((user) => user.id);

    const [lendings, reservations] = await Promise.all([
      isStringInArrayCaseInsensitive(getUserIncludes.Lendings, include)
        ? this.findLendingForSearchUser(userIds)
        : Promise.resolve([]),
      isStringInArrayCaseInsensitive(getUserIncludes.Reservations, include)
        ? this.getUserReservations(userIds)
        : Promise.resolve([]),
    ]);

    const lendingMap = Map.groupBy(lendings, (lendings) => lendings.userId);
    const reservationMap = Map.groupBy(
      reservations,
      (reservations) => reservations.userId,
    );

    const updatedResponseDto = responseDto.map((userDto) => {
      let result: GetUserResponseDto = { ...userDto };
      const userId = userDto.id;
      if (lendings.length) {
        result.lendings = lendingMap.get(userId) || [];
        result.overDueDay = this.getOverDueDay(result.lendings);
      }
      if (reservations.length) {
        result.reservations = reservationMap.get(userId) || [];
      }
      return result;
    });

    return [updatedResponseDto, total];
  }

  async getUserReservations(userIds: number[]): Promise<UserReservation[]> {
    // return await this.userReservationRepository.find({
    //   where: { userId: In(userIds) },
    // });
    return await this.findActiveReservations(userIds);
  }

  async createUser(email: string, password: string): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Duplicate email');
    }

    let hashedPassword: string;
    hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });
    return await this.usersRepository.save(user);
  }

  async updateUser(
    id: number,
    requestData: UpdateUsersRequestDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const updatedUser = this.usersRepository.merge(user, requestData);
    return await this.usersRepository.save(updatedUser);
  }

  async findLendingForSearchUser(userIds: number[]) {
    const lendings = await this.findActiveLendings(userIds);

    const results = await Promise.all(
      lendings.map(async (lending) => {
        const currentDate = new Date();
        const dueDate = new Date(lending.duedate);
        const overDueDay =
          currentDate > dueDate
            ? Math.floor(
                (currentDate.getTime() - dueDate.getTime()) /
                  (1000 * 60 * 60 * 24),
              )
            : 0;

        const reservedNum = await this.reservationRepository.count({
          where: { bookInfoId: lending.bookInfoId, status: 0 },
        });

        return {
          ...lending,
          overDueDay,
          reservedNum,
        };
      }),
    );

    return results;
  }

  async findActiveLendings(
    userIds: number[],
  ): Promise<LendingsForSearchUserDto[]> {
    return this.lendingRepository
      .createQueryBuilder('l')
      .select('u.id', 'userId')
      .addSelect('bi.id', 'bookInfoId')
      .addSelect('l.createdAt', 'lendDate')
      .addSelect('l.lendingCondition', 'lendingCondition')
      .addSelect('bi.image', 'image')
      .addSelect('bi.author', 'author')
      .addSelect('bi.title', 'title')
      .addSelect('DATE_ADD(l.createdAt, INTERVAL 14 DAY)', 'duedate')
      .innerJoin('user', 'u', 'l.userId = u.id')
      .leftJoin('book', 'b', 'l.bookId = b.id')
      .leftJoin('book_info', 'bi', 'b.infoid = bi.id')
      .where('l.returnedAt IS NULL')
      .where('u.id IN (:...userIds)', { userIds })
      .getRawMany();
  }

  async findActiveReservations(
    userIds: number[],
  ): Promise<UserReservationsDto[]> {
    const reservations = await this.reservationRepository
      .createQueryBuilder('r')
      .select('r.id', 'reservationId')
      .addSelect('r.bookInfoId', 'reservedBookInfoId')
      .addSelect('r.createdAt', 'reservationDate')
      .addSelect('r.endAt', 'endAt')
      .addSelect('bi.title', 'title')
      .addSelect('bi.author', 'author')
      .addSelect('bi.image', 'image')
      .addSelect('r.userId', 'userId')
      .leftJoin('book_info', 'bi', 'r.bookInfoId = bi.id')
      .where('r.status = 0')
      .andWhere('r.userId IN (:...userIds)', { userIds })
      .getRawMany();

    // Perform ranking calculation manually in JavaScript
    return reservations.map((reservation) => {
      const ranking = reservations.filter(
        (r) =>
          r.bookInfoId === reservation.bookInfoId &&
          r.createdAt <= reservation.createdAt,
      ).length;
      return { ...reservation, ranking };
    });
  }
}
