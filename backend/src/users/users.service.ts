import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Search,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  User,
  UserReservation,
  VLending,
  VLendingForSearchUser,
} from 'src/entities';
import { In, Like, Repository } from 'typeorm';
import {
  GetUserResponseDto,
  GetUsersRequestDto,
  GetUsersResponseDto,
  UpdateUsersRequestDto,
} from './dto/users.dto';
import { getUserIncludes } from './users.enums';
import { isStringInArrayCaseInsensitive } from 'src/common/utils/utils';
import * as bcrypt from 'bcrypt';
import { resourceLimits } from 'worker_threads';
import { UserInclude } from './schema/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(VLendingForSearchUser)
    private readonly vLendingForSearchUserRepository: Repository<VLendingForSearchUser>,
    @InjectRepository(UserReservation)
    private readonly userReservationRepository: Repository<UserReservation>,
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
        ? this.vLendingForSearchUserRepository.find({
            where: { userId: id },
          })
        : ([] as VLendingForSearchUser[]),
      includes.includes('reservations')
        ? this.userReservationRepository.find({
            where: { userId: id },
          })
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
    const { search, page, limit, include } = query;

    const [users, total] = await this.usersRepository.findAndCount({
      where: search
        ? { nickname: Like(`%${search}%`), email: Like(`%${search}%`) }
        : {},
      take: limit,
      skip: (page - 1) * limit,
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
        ? this.getUserLendings(userIds)
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

  async getUserLendings(userIds: number[]): Promise<VLendingForSearchUser[]> {
    return await this.vLendingForSearchUserRepository.find({
      where: { userId: In(userIds) },
    });
  }

  async getUserReservations(userIds: number[]): Promise<UserReservation[]> {
    return await this.userReservationRepository.find({
      where: { userId: In(userIds) },
    });
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
}
