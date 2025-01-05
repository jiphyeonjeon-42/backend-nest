import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import {
  User,
  VLendingForSearchUser,
  UserReservation,
} from 'src/database/entities';
import { Repository } from 'typeorm';
import { UserInclude } from './schema/users.schema';
import { BadRequestException } from '@nestjs/common';
import { UpdateUsersRequestDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';
import { Order } from 'src/common/dtos/page-options.dto';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;
  let vLendingForSearchUserRepository: Repository<VLendingForSearchUser>;
  let userReservationRepository: Repository<UserReservation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(VLendingForSearchUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserReservation),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    vLendingForSearchUserRepository = module.get<
      Repository<VLendingForSearchUser>
    >(getRepositoryToken(VLendingForSearchUser));
    userReservationRepository = module.get<Repository<UserReservation>>(
      getRepositoryToken(UserReservation),
    );
  });

  describe('findOne', () => {
    it('should return null if user is not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      const result = await service.findOne(1, []);
      expect(result).toBeNull();
    });

    it('should return user without includes if includes is empty', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        nickname: 'test',
      } as User;
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findOne(1, []);
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        nickname: 'test',
      });
    });

    it('should return user with lendings and reservations if includes are provided', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        nickname: 'test',
      } as User;
      const lendings = [
        { userId: 1, overDueDay: 5 },
      ] as VLendingForSearchUser[];
      const reservations = [{ userId: 1 }] as UserReservation[];

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(vLendingForSearchUserRepository, 'find')
        .mockResolvedValue(lendings);
      jest
        .spyOn(userReservationRepository, 'find')
        .mockResolvedValue(reservations);

      const result = await service.findOne(1, ['lendings', 'reservations']);
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        nickname: 'test',
        lendings,
        overDueDay: 5,
        reservations,
      });
    });

    it('should return user with only lendings if only lendings are included', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        nickname: 'test',
      } as User;
      const lendings = [
        { userId: 1, overDueDay: 5 },
      ] as VLendingForSearchUser[];

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(vLendingForSearchUserRepository, 'find')
        .mockResolvedValue(lendings);
      jest.spyOn(userReservationRepository, 'find').mockResolvedValue([]);

      const result = await service.findOne(1, ['lendings']);
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        nickname: 'test',
        lendings,
        overDueDay: 5,
      });
    });

    it('should return user with only reservations if only reservations are included', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        nickname: 'test',
      } as User;
      const reservations = [{ userId: 1 }] as UserReservation[];

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(vLendingForSearchUserRepository, 'find').mockResolvedValue([]);
      jest
        .spyOn(userReservationRepository, 'find')
        .mockResolvedValue(reservations);

      const result = await service.findOne(1, ['reservations']);
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        nickname: 'test',
        reservations,
      });
    });

    describe('findAll', () => {
      it('should return users without includes if includes is empty', async () => {
        const query = {
          search: '',
          page: 1,
          take: 10,
          include: [],
          order: Order.ASC,
          skip: 0,
        };
        const users = [
          { id: 1, email: 'test1@example.com', nickname: 'test1' },
          { id: 2, email: 'test2@example.com', nickname: 'test2' },
        ] as User[];
        const total = 2;

        jest
          .spyOn(usersRepository, 'findAndCount')
          .mockResolvedValue([users, total]);

        const result = await service.findAll(query);
        expect(result).toEqual([
          [
            { id: 1, email: 'test1@example.com', nickname: 'test1' },
            { id: 2, email: 'test2@example.com', nickname: 'test2' },
          ],
          total,
        ]);
      });

      it('should return users with lendings and reservations if includes are provided', async () => {
        const query = {
          search: '',
          page: 1,
          take: 10,
          include: [UserInclude.LENDINGS, UserInclude.RESERVATIONS],
          order: Order.ASC,
          skip: 0,
        };
        const users = [
          { id: 1, email: 'test1@example.com', nickname: 'test1' },
          { id: 2, email: 'test2@example.com', nickname: 'test2' },
        ] as User[];
        const total = 2;
        const lendings = [
          { userId: 1, overDueDay: 5 },
        ] as VLendingForSearchUser[];
        const reservations = [{ userId: 1 }] as UserReservation[];

        jest
          .spyOn(usersRepository, 'findAndCount')
          .mockResolvedValue([users, total]);
        jest.spyOn(service, 'getUserLendings').mockResolvedValue(lendings);
        jest
          .spyOn(service, 'getUserReservations')
          .mockResolvedValue(reservations);

        const result = await service.findAll(query);
        expect(result).toEqual([
          [
            {
              id: 1,
              email: 'test1@example.com',
              nickname: 'test1',
              lendings,
              reservations,
              overDueDay: 5,
            },
            {
              id: 2,
              email: 'test2@example.com',
              nickname: 'test2',
              overDueDay: 0,
              lendings: [],
              reservations: [],
            },
          ],
          total,
        ]);
      });

      it('should return users with only lendings if only lendings are included', async () => {
        const query = {
          search: '',
          page: 1,
          take: 10,
          include: [UserInclude.LENDINGS],
          order: Order.ASC,
          skip: 0,
        };
        const users = [
          { id: 1, email: 'test1@example.com', nickname: 'test1' },
          { id: 2, email: 'test2@example.com', nickname: 'test2' },
        ] as User[];
        const total = 2;
        const lendings = [
          { userId: 1, overDueDay: 5 },
        ] as VLendingForSearchUser[];

        jest
          .spyOn(usersRepository, 'findAndCount')
          .mockResolvedValue([users, total]);
        jest.spyOn(service, 'getUserLendings').mockResolvedValue(lendings);
        jest.spyOn(service, 'getUserReservations').mockResolvedValue([]);

        const result = await service.findAll(query);
        expect(result).toEqual([
          [
            {
              id: 1,
              email: 'test1@example.com',
              nickname: 'test1',
              lendings,
              overDueDay: 5,
            },
            {
              id: 2,
              email: 'test2@example.com',
              nickname: 'test2',
              lendings: [],
              overDueDay: 0,
            },
          ],
          total,
        ]);
      });

      it('should return users with only reservations if only reservations are included', async () => {
        const query = {
          search: '',
          page: 1,
          take: 10,
          include: [UserInclude.RESERVATIONS],
          order: Order.ASC,
          skip: 0,
        };
        const users = [
          { id: 1, email: 'test1@example.com', nickname: 'test1' },
          { id: 2, email: 'test2@example.com', nickname: 'test2' },
        ] as User[];
        const total = 2;
        const reservations = [{ userId: 1 }] as UserReservation[];

        jest
          .spyOn(usersRepository, 'findAndCount')
          .mockResolvedValue([users, total]);
        jest.spyOn(service, 'getUserLendings').mockResolvedValue([]);
        jest
          .spyOn(service, 'getUserReservations')
          .mockResolvedValue(reservations);

        const result = await service.findAll(query);
        expect(result).toEqual([
          [
            {
              id: 1,
              email: 'test1@example.com',
              nickname: 'test1',
              reservations,
            },
            {
              id: 2,
              email: 'test2@example.com',
              nickname: 'test2',
              reservations: [],
            },
          ],
          total,
        ]);
      });

      it('should return users matching the search criteria', async () => {
        const query = {
          search: 'test1',
          page: 1,
          take: 10,
          include: [],
          order: Order.ASC,
          skip: 0,
        };
        const users = [
          { id: 1, email: 'test1@example.com', nickname: 'test1' },
        ] as User[];
        const total = 1;

        jest
          .spyOn(usersRepository, 'findAndCount')
          .mockResolvedValue([users, total]);

        const result = await service.findAll(query);
        expect(result).toEqual([
          [{ id: 1, email: 'test1@example.com', nickname: 'test1' }],
          total,
        ]);
      });

      describe('createUser', () => {
        it('should throw BadRequestException if email already exists', async () => {
          const email = 'test@example.com';
          const password = 'password';
          const existingUser = { id: 1, email } as User;

          jest
            .spyOn(usersRepository, 'findOne')
            .mockResolvedValue(existingUser);

          await expect(service.createUser(email, password)).rejects.toThrow(
            BadRequestException,
          );
        });

        it('should create a new user if email does not exist', async () => {
          const email = 'test@example.com';
          const password = 'password';
          const hashedPassword = 'hashedPassword';
          const newUser = { id: 1, email, password: hashedPassword } as User;

          jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
          (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
          jest.spyOn(usersRepository, 'create').mockReturnValue(newUser);
          jest.spyOn(usersRepository, 'save').mockResolvedValue(newUser);

          const result = await service.createUser(email, password);
          expect(result).toEqual(newUser);
          expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
          expect(usersRepository.create).toHaveBeenCalledWith({
            email,
            password: hashedPassword,
          });
          expect(usersRepository.save).toHaveBeenCalledWith(newUser);
        });

        describe('updateUser', () => {
          it('should throw BadRequestException if user is not found', async () => {
            const id = 1;
            const requestData = {
              email: 'new@example.com',
            } as UpdateUsersRequestDto;

            jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

            await expect(service.updateUser(id, requestData)).rejects.toThrow(
              BadRequestException,
            );
          });

          it('should update and return the user if user is found', async () => {
            const id = 1;
            const requestData = {
              email: 'new@example.com',
            } as UpdateUsersRequestDto;
            const user = { id, email: 'old@example.com' } as User;
            const updatedUser = { ...user, ...requestData } as User;

            jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(usersRepository, 'merge').mockReturnValue(updatedUser);
            jest.spyOn(usersRepository, 'save').mockResolvedValue(updatedUser);

            const result = await service.updateUser(id, requestData);
            expect(result).toEqual(updatedUser);
            expect(usersRepository.findOne).toHaveBeenCalledWith({
              where: { id },
            });
            expect(usersRepository.merge).toHaveBeenCalledWith(
              user,
              requestData,
            );
            expect(usersRepository.save).toHaveBeenCalledWith(updatedUser);
          });
        });
      });
    });
  });
});
