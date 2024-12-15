import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { intSchema } from 'src/dto';

export const metaSchema = z.object({
  totalItems: extendApi(intSchema, {
    description: '전체 항목 수',
    example: 100,
  }),
  itemCount: extendApi(intSchema, {
    description: '현재 페이지의 항목 수',
    example: 10,
  }),
  itemsPerPage: extendApi(intSchema, {
    description: '페이지당 항목 수',
    example: 10,
  }),
  totalPages: extendApi(intSchema, {
    description: '전체 페이지 수',
    example: 10,
  }),
  currentPage: extendApi(intSchema, {
    description: '현재 페이지 번호',
    example: 1,
  }),
});

export class MetaDto extends createZodDto(metaSchema) {}
