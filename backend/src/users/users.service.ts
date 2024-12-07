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
} from './dto/users.dto';
import { getUserIncludes } from './users.enums';
import { isStringInArrayCaseInsensitive } from 'src/common/utils/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(VLendingForSearchUser)
    private readonly userLendingRepository: Repository<VLendingForSearchUser>,
    @InjectRepository(UserReservation)
    private readonly userReservationRepository: Repository<UserReservation>,
  ) {}

  /**
   *
   * @param id 유저 id
   * @param includes optional data to include [lendings, reservations]
   * @returns if user found, return GetUserResponseDto, else return null
   */
  async getUserWithOptionalData(
    id: number,
    includes: string[] | null | undefined,
  ): Promise<GetUserResponseDto | null> {
    const userResponseDto: GetUserResponseDto = new GetUserResponseDto();
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) return null;

    Object.assign(userResponseDto, user);
    console.log('includes', includes);
    if (!includes) return userResponseDto;
    if (includes.includes('lendings')) {
      userResponseDto.lendings = await this.userLendingRepository.find({
        where: { userId: id },
      });
      console.log(userResponseDto.lendings);
    }
    if (includes.includes('reservations')) {
      userResponseDto.reservations = await this.userReservationRepository.find({
        where: { userId: id },
      });
    }
    //overDueDay
    userResponseDto.overDueDay = this.getOverDueDay(userResponseDto.lendings);
    return userResponseDto;
  }

  getOverDueDay(lendings: VLendingForSearchUser[] | undefined | null): number {
    if (!lendings) return 0;
    return lendings.reduce((acc, cur) => (acc += cur.overDueDay), 0);
  }

  async findAll(query: GetUsersRequestDto): Promise<[any, number]> {
    const { search, page, limit, include } = query;

    const [users, total] = await this.usersRepository.findAndCount({
      where: search
        ? { nickname: Like(`%${search}%`), email: Like(`%${search}%`) }
        : {},
      take: limit,
      skip: (page - 1) * limit,
    });
    const responseDto: GetUserResponseDto[] = [];
    const userIds = users.map((user) => user.id);
    users.forEach((user) => {
      const userDto = new GetUserResponseDto();
      Object.assign(userDto, user);
      responseDto.push(userDto);
    });
    if (!include) {
      return [responseDto, total];
    }
    if (isStringInArrayCaseInsensitive(getUserIncludes.Lendings, include)) {
      const lendings = await this.getUserLendings(userIds);
      const lendingMap = this.mapUserIdItemsToUsers(users, lendings);
      responseDto.map((userDto) => {
        userDto.lendings = lendingMap[userDto.id] || []; // Add user's lendings or empty array if none
        userDto.overDueDay = this.getOverDueDay(userDto.lendings);
      });
    }
    if (isStringInArrayCaseInsensitive(getUserIncludes.Reservations, include)) {
      const reservations = await this.getUserReservations(userIds);
      const reservationMap = this.mapUserIdItemsToUsers(users, reservations);
      responseDto.map((userDto) => {
        userDto.reservations = reservationMap[userDto.id] || []; // Add user's reservations or empty array if none
      });
    }
    return [responseDto, total];
  }

  mapUserIdItemsToUsers = <T extends { userId: number }>(
    users: User[],
    items: T[],
  ): Record<number, T[]> => {
    // Create a mapping of userId to their lendings
    const itemMap = items.reduce(
      (acc, item) => {
        if (!acc[item.userId]) {
          acc[item.userId] = [];
        }
        acc[item.userId].push(item);
        return acc;
      },
      {} as Record<number, any[]>,
    );

    return itemMap;
  };

  async getUserLendings(userIds: number[]): Promise<VLendingForSearchUser[]> {
    return await this.userLendingRepository.find({
      where: { userId: In(userIds) },
    });
  }

  async getUserReservations(userIds: number[]): Promise<UserReservation[]> {
    return await this.userReservationRepository.find({
      where: { userId: In(userIds) },
    });
  }
}
