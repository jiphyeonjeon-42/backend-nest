import { extendApi } from '@anatine/zod-openapi';
import { paginationRequestSchema } from 'src/common/schema/schema';
import { zCoercedEnum } from 'src/common/utils/utils';
import { z } from 'zod';

const getUserSearchSchema = z.object({
  search: z.string().optional().describe('검색할 유저의 nickname or email'),
});

export enum UserInclude {
  LENDINGS = 'lendings',
  RESERVATIONS = 'reservations',
}

export const getUserRequestSchema = z.object({
  include: z
    .preprocess(
      (value) => {
        const arrayValue = Array.isArray(value) ? value : value ? [value] : [];
        return arrayValue.map((item) =>
          typeof item === 'string' ? item.toLowerCase() : item,
        );
      },
      z.array(z.enum([UserInclude.LENDINGS, UserInclude.RESERVATIONS])),
    )
    .optional()
    .nullable()
    .describe('포함할 데이터'),
});

export const getUsersRequestSchema = getUserSearchSchema
  .merge(paginationRequestSchema)
  .merge(getUserRequestSchema);

const user = z.object({
  id: z.coerce.number().int().describe('유저 번호').min(0),
  email: z.string().describe('이메일'),
  nickname: z.string().describe('닉네임').nullable(),
  intraId: z.coerce
    .number()
    .int()
    .describe('인트라 고유 번호')
    .min(0)
    .nullable(),
  slack: z.string().describe('slack 멤버 Id').nullable(),
  penaltyEndDate: z.date().describe('패널티 끝나는 날짜'),
  role: z.coerce.number().int().describe('권한'),
});

const VlendingForSearchUser = z.object({
  userId: z.coerce.number().int(),
  bookInfoId: z.coerce.number().int(),
  lendDate: z.coerce.date(),
  lendingCondition: z.string(),
  image: z.string().url('이미지 URL이 아닙니다.'),
  author: z.string().min(1),
  title: z.string().min(1),
  duedate: z.coerce.date(),
  overDueDay: z.coerce.number().int().min(0).describe('연체된 날수'),
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

export const getUsersResponseInnerSchema = z
  .object({
    overDueDay: z.coerce.number().int().optional().describe('현재 연체된 날수'),
    reservations: z
      .array(VUserReservations)
      .optional()
      .describe('해당 유저의 예약 정보'),
    lendings: z
      .array(VlendingForSearchUser)
      .optional()
      .describe('해당 유저의 대출 정보'),
  })
  .merge(user);

const getUsersResponseMetaSchema = z.object({
  totalItems: z.coerce.number().int().describe('전체 검색 결과 수'),
  itemCount: z.coerce.number().int().describe('현재 페이지 검색 결과 수'),
  itemsPerPage: z.coerce.number().int().describe('페이지 당 검색 결과 수'),
  totalPages: z.coerce.number().int().describe('전체 결과 페이지 수'),
  currentPage: z.coerce.number().int().describe('현재 페이지'),
});

export const getUsersResponseSchema = z
  .array(getUsersResponseInnerSchema)
  .default([])
  .describe('유저 정보 목록');

export const getUsersResponseArraySchema = z.array(getUsersResponseInnerSchema);

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
  lendings: extendApi(
    z.array(VlendingForSearchUser).describe('해당 유저의 대출 정보'),
    {
      example: [],
    },
  ),
});
