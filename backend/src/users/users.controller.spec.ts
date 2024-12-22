import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { findOneSchema } from 'src/common/schema/schema';
import { updateUsersRequestSchema } from './schema/users.schema';

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
            updateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should throw BadRequestException when all fields are missing', async () => {
    const id = '1';
    const updateUser = {}; // Simulating all fields missing in the query

    // Mock schema validation
    jest.spyOn(findOneSchema, 'safeParse').mockReturnValueOnce({
      success: true,
      data: Number(id),
    });
    jest.spyOn(updateUsersRequestSchema, 'safeParse').mockReturnValueOnce({
      success: true,
      data: updateUser,
    });

    await expect(controller.update(id, updateUser)).rejects.toThrow(
      BadRequestException,
    );
  });
});
