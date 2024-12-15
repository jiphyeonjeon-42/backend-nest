import { mock } from 'node:test';
import { GetUserResponseDto } from '../dto/users.dto';

export const mockUsers = {
  id: 1,
  email: 'test@example.com',
  nickname: 'testuser',
  intraId: 12345,
  slack: 'U12345',
  penaltyEndDate: new Date('2023-12-31'),
  role: 1,
  overDueDay: 0,
};

const mockReservations = [
  {
    reservationId: 1,
    reservedBookInfoId: 101,
    reservationDate: new Date('2023-01-01'),
    endAt: new Date('2023-01-15'),
    ranking: 1,
    title: 'Book Title 1',
    author: 'Author 1',
    image: 'http://example.com/image1.jpg',
    userId: 1,
  },
];

export const mockVLendings = [
  {
    userId: 1,
    bookInfoId: 201,
    lendDate: new Date('2023-01-01'),
    lendingCondition: 'Good',
    image: 'http://example.com/image2.jpg',
    author: 'Author 2',
    title: 'Book Title 2',
    duedate: new Date('2023-01-15'),
    overDueDay: 0,
    reservedNum: 0,
  },
];

export const mockGetUserWithLendingsReservations: GetUserResponseDto = {
  ...mockUsers,
  reservations: mockReservations,
  lendings: mockVLendings,
};

export const mockGetUserWithReservations: GetUserResponseDto = {
  ...mockUsers,
  reservations: mockReservations,
};

export const mockGetUserWithLendings: GetUserResponseDto = {
  ...mockUsers,
  lendings: mockVLendings,
};
