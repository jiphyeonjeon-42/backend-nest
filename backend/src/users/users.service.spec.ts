import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {
  User,
  UserReservation,
  VLending,
  VLendingForSearchUser,
} from 'src/entities';
import { getRepository, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    // Add other methods you use in your service
  };

  const mockVLendingForSearchUserRepository = {
    // Add mock methods
  };

  const mockUserReservationRepository = {
    // Add mock methods
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(VLendingForSearchUser),
          useValue: mockVLendingForSearchUserRepository,
        },
        {
          provide: getRepositoryToken(UserReservation),
          useValue: mockUserReservationRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
