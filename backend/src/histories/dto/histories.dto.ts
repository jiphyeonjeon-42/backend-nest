import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const getHistoriesSchema = z.object({
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

export class getHistoriesDto extends createZodDto(getHistoriesSchema) {}
