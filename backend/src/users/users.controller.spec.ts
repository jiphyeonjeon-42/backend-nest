import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GetUserResponseDto } from './dto/users.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  mockGetUserWithLendings,
  mockGetUserWithLendingsReservations,
  mockGetUserWithReservations,
  mockUsers,
} from './mockdata/users.mockdata';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('findOne', () => {
    describe('includes test', () => {
      it('should return user info with lendings and reservations', async () => {
        const result: GetUserResponseDto = mockGetUserWithLendingsReservations;
        jest.spyOn(service, 'findOne').mockResolvedValue(result);

        expect(
          await controller.findOne('1', ['lendings', 'reservations']),
        ).toStrictEqual(result);
      });

      test.each([
        [['lendings', 'reservations']],
        [['LendIngS', 'RESERVATIONS']],
      ])('should return regardless of case sensitivity', async (includes) => {
        const result: GetUserResponseDto = mockGetUserWithLendingsReservations;
        jest.spyOn(service, 'findOne').mockResolvedValue(result);

        expect(await controller.findOne('1', includes)).toStrictEqual(result);
      });

      it('should return user info with lendings', async () => {
        const result: GetUserResponseDto = mockGetUserWithLendings;
        jest.spyOn(service, 'findOne').mockResolvedValue(result);

        const response = await controller.findOne('1', ['lendings']);
        expect(response).toEqual(result);
        expect(response).not.toHaveProperty('reservations');
      });

      it('should return user info with reservations', async () => {
        const result: GetUserResponseDto = mockGetUserWithReservations;
        jest.spyOn(service, 'findOne').mockResolvedValue(result);

        const response = await controller.findOne('1', ['reservations']);
        expect(response).toEqual(result);
        expect(response).not.toHaveProperty('lendings');
      });

      test('should return user info without includes', async () => {
        const result: GetUserResponseDto = mockUsers;
        jest.spyOn(service, 'findOne').mockResolvedValue(result);

        const response = await controller.findOne('1', []);
        expect(response).toEqual(result);
        expect(response).not.toHaveProperty('lendings');
        expect(response).not.toHaveProperty('reservations');
      });

      test.each([
        [['superherolending'], BadRequestException],
        [['lendings', 'reserved'], BadRequestException],
        [[''], BadRequestException],
        [['1234'], BadRequestException],
      ])(
        'should fail with invalid includes',
        async (include, expectedException) => {
          const result: GetUserResponseDto = mockUsers;
          jest.spyOn(service, 'findOne').mockResolvedValue(result);

          await expect(controller.findOne('1', include)).rejects.toThrow(
            expectedException,
          );
        },
      );
    });

    describe('invalid user id', () => {
      it('should throw NotFoundException', async () => {
        jest.spyOn(service, 'findOne').mockResolvedValue(null);

        await expect(controller.findOne('0', [])).rejects.toThrow(
          NotFoundException,
        );
      });

      test.each([['-1'], ['abc']])(
        'should throw BadRequestException',
        async (userId) => {
          jest.spyOn(service, 'findOne').mockResolvedValue(mockUsers);

          await expect(controller.findOne(userId, [])).rejects.toThrow(
            BadRequestException,
          );
        },
      );
    });
  });
});
