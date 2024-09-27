import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const getUsersRequestSchema = z.object({
  nicknameOrEmail: z.string().describe('검색할 유저의 nickname or email'),
  page: z.coerce.number().int().describe('페이지').min(1),
  limit: z.coerce
    .number()
    .int()
    .describe(' 한 페이지에 들어올 검색결과 수 ')
    .min(1),
  id: z.coerce.number().int().describe('유저의 id').min(0),
});

const lending = z.object({
  userId: z.coerce.number(),
  bookInfoId: z.coerce.number(),
  lendDate: z.coerce.date(),
  lendingCondition: z.string(),
  image: z.string(),
  author: z.string(),
  title: z.string(),
  duedate: z.coerce.date(),
  overDueDay: z.coerce.number(),
  reservedNum: z.coerce.number().min(0),
});

const VUserReservations = z.object({
  reservationId: z.coerce.number().min(0),
  reservedBookInfoId: z.coerce.number().min(0),
  reservationDate: z.coerce.date(),
  endAt: z.coerce.date(),
  ranking: z.coerce.number().min(0),
  title: z.string(),
  author: z.string(),
  image: z.string(),
  userId: z.coerce.number().min(0),
});

const getUsersResponseInnerSchema = z.object({
  id: z.coerce.number().int().describe('유저 번호').min(0),
  email: z.string().describe('이메일'),
  nickname: z.string().describe('닉네임'),
  intraId: z.coerce.number().int().describe('인트라 고유 번호').min(0),
  slack: z.string().describe('slack 멤버 Id'),
  penaltyEndDate: z.string().describe('패널티 끝나는 날짜'),
  overDueDay: z.coerce.number().describe('현재 연체된 날수').min(0),
  role: z.coerce.number().int().describe('권한'),
  reservations: z.array(VUserReservations).describe('해당 유저의 예약 정보'),
  lendings: z.array(lending).describe('해당 유저의 대출 정보'),
});

const getUsersResponseMetaSchema = z.object({
  totalItems: z.coerce.number().int().describe('전체 검색 결과 수'),
  itemCount: z.coerce.number().int().describe('현재 페이지 검색 결과 수'),
  itemsPerPage: z.coerce.number().int().describe('페이지 당 검색 결과 수'),
  totalPages: z.coerce.number().int().describe('전체 결과 페이지 수'),
  currentPage: z.coerce.number().int().describe('현재 페이지'),
});

export const getUsersResponseSchema = z.object({
  items: z.array(getUsersResponseInnerSchema).describe('유저 정보 목록'),
  meta: getUsersResponseMetaSchema.describe('유저 수와 관련된 정보'),
});

export const createUsersRequestSchema = z.object({
  email: z.string().describe('이메일'),
  password: z.string().describe('비밀번호'),
});

export const updateUsersParamSchema = z.object({
  id: z.coerce.number().int().describe('변경할 유저의 id 값').min(0),
});

export const updateUsersRequestSchema = z.object({
  nickname: z.string(),
  intraId: z.coerce.number().int().min(0).describe('인트라 ID'),
  slack: z.string().describe('slack 멤버 변수'),
  role: z.coerce.number().int().describe('유저의 권한'),
  penaltyEndDate: z.date().describe('패널티 끝나는 날짜'),
});

export const updateUsersResponseSchema = updateUsersRequestSchema;

export const myUpdateUsersRequestSchema = createUsersRequestSchema;

export const getAPIVersionResponseSchema = z.object({
  version: extendApi(z.string().describe('API 버전'), {
    example: 'gshim.v1',
  }),
});

export const getMyUserInfoResponseSchema = z.object({
  nickname: extendApi(z.string().describe('닉네임'), { example: 'jimin' }),
  intraId: extendApi(z.number().describe('인트라 ID'), { example: 10035 }),
  slack: extendApi(z.string().describe('slack 멤버 변수'), {
    example: 'U02LNNDRC9F',
  }),
  role: extendApi(z.coerce.number().describe('유저의 권한'), { example: 2 }),
  penaltyEndDate: extendApi(z.date().describe('패널티 끝나는 날짜'), {
    example: '2021-08-01',
  }),
  overDueDay: extendApi(z.coerce.number().describe('현재 연체된 날수'), {
    example: 0,
  }),
  reservations: extendApi(
    z.array(VUserReservations).describe('해당 유저의 예약 정보'),
    {
      example: [],
    },
  ),
  lendings: extendApi(z.array(lending).describe('해당 유저의 대출 정보'), {
    example: [],
  }),
});
