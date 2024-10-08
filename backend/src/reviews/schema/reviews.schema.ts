import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const createReviewsRequestSchema = z.object({
  bookInfoId: extendApi(z.coerce.number().int(), { example: 42 }),
  content: extendApi(z.string(), { example: '책이 좋네요 열글자.' }),
});

export const getReviewsRequestSchema = z.object({
  titleOrNickname: z
    .string()
    .describe('책 제목 또는 닉네임을 검색어로 받는다.'),
  page: z.coerce
    .number()
    .int()
    .optional()
    .describe('해당하는 페이지를 보여준다.'),
  disabled: z.coerce
    .number()
    .int()
    .describe(
      '0이라면 공개 리뷰를, 1이라면 비공개 리뷰를, -1이라면 모든 리뷰를 가져온다.',
    ),
  limit: z.coerce
    .number()
    .int()
    .optional()
    .describe(
      '한 페이지에서 몇 개의 게시글을 가져올 지 결정한다. [default = 10]',
    ),
  sort: z
    .string()
    .optional()
    .describe('asc, desc 값을 통해 시간순으로 정렬된 페이지를 반환한다.'),
});

const getReviewsItemSchema = z.object({
  reviewsId: z.coerce.number().int(),
  reviewerId: z.coerce.number().int(),
  bookInfoId: z.coerce.number().int(),
  content: z.string(),
  createdAt: z.string().datetime(), // Use .datetime() for date-time strings
  title: z.string().max(255),
  nickname: z.string().max(255).nullable(),
  intraId: z.coerce.number().int().nullable(),
});

// Define the schema for the meta object
const getReivewsMetaSchema = z.object({
  totalItems: z.coerce.number().int(),
  itemCount: z.coerce.number().int(),
  itemsPerPage: z.coerce.number().int(),
  totalPages: z.coerce.number().int(),
  currentPage: z.coerce.number().int(),
  finalPage: z.boolean(),
});

// Combine both schemas into the main schema
export const getReviewsResponseSchema = z.object({
  items: z.array(getReviewsItemSchema),
  meta: getReivewsMetaSchema,
});

export const getMyReviewsRequestSchema = z.object({
  name: z.string().describe('책 제목 또는 닉네임을 검색어로 받는다.'),
  limit: z
    .number()
    .int()
    .default(10)
    .optional()
    .describe(
      '한 페이지에서 몇 개의 게시글을 가져올 지 결정한다. [default = 10]',
    ),
  page: z.number().int().optional().describe('해당하는 페이지를 보여준다.'),
  sort: z.enum(['asc', 'desc']).optional(),
  isMyReview: z.boolean().default(false),
});

export const getMyReviewsResponseSchema = getReviewsResponseSchema;

export const updateReviewsPathSchema = z.object({
  reviewsId: z.string().describe('수정할 reviews ID'),
});

export const updateReviewsRequestSchema = z.object({
  content: extendApi(z.string(), { example: '책이 좋네요 열글자.' }),
});

export const patchReviewsPathSchema = updateReviewsPathSchema;

export const deleteReviewsPathSchema = updateReviewsPathSchema;
