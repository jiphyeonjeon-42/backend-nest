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
import { mockGetUserWithLendings, mockUsers, mockVLendings } from './mockdata/users.mockdata';
import { find } from 'rxjs';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;
  const mockUserReservationRepository = {
    find: jest.fn(),
  };
  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    // Add other methods you use in your service
  };
  const mockVLendingForSearchUserRepository = {
    // Add mock methods
    find: jest.fn(),
  };
  
  const mockGetOverDueDay = jest.fn();

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
 
  describe('findOne', () => {
    it('should return null when no user found', async() => {
      mockUserRepository.findOne.mockResolvedValue(null);
      const result = await service.findOne(1, null);
      expect(result).toBeNull();
    });

    it('should return user when no includes', async() => {
      mockUserRepository.findOne.mockResolvedValue(mockUsers);
      const result = await service.findOne(1, null);
      expect(result).toEqual(mockUsers);
    });

    it('should return user with lendings', async() => {
      mockUserRepository.findOne.mockResolvedValue(mockUsers);
      mockVLendingForSearchUserRepository.find.mockResolvedValue(mockVLendings);
      const result = await service.findOne(1, ['lendings']);
      expect(result).toEqual(mockGetUserWithLendings);
    });

    
  });
});
