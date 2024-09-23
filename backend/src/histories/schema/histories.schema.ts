import { z } from 'zod';

export const getHistoriesRequestSchema = z.object({
  who: z
    .enum(['all', 'my'])
    .describe(
      '모든 사용자의 기록을 볼 것인지, 본인의 기록만 볼 것인지 결정하는 필터',
    ),
  query: z.string().optional().describe('검색어'),
  type: z
    .enum(['user', 'title', 'callsign', 'bookId'])
    .optional()
    .describe('어떤 값들로 검색하고 싶은지 결정하는 필터'),
  page: z.number().optional().describe('페이지 번호'),
  limit: z.number().optional().describe('한 페이지에 보여줄 항목 수'),
});

export const getHistoriesResponseSchema = z.object({
  items: z.array(
    z.object({
      id: z.number().int(),
      lendingCondition: z.string(),
      login: z.string(),
      returningCondition: z.string(),
      penaltyDays: z.number().int(),
      callSign: z.string(),
      title: z.string(),
      bookInfoId: z.number().int(),
      createdAt: z.string(),
    }),
  ),
  meta: z.object({
    totalItems: z.number().positive().describe('전체 대출 기록 수'),
    itemCount: z.number().positive().describe('현재 페이지의 대출 기록 수'),
    itemsPerPage: z
      .number()
      .positive()
      .describe('한 페이지에 보여줄 대출 기록 수'),
    totalPages: z.number().positive().describe('전체 페이지 수'),
    currentPage: z.number().positive().describe('현재 페이지 번호'),
  }),
});
