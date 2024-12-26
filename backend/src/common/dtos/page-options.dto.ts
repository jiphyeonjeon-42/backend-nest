import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { positiveSchema } from 'src/dto';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
export type PaginationOption = z.infer<typeof paginationOptionsSchema>;
export const paginationOptionsSchema = z.object({
  order: extendApi(z.nativeEnum(Order).optional().default(Order.ASC), {
    description: '정렬 순서 (ASC: 오름차순, DESC: 내림차순)',
    example: Order.ASC,
  }),
  page: extendApi(positiveSchema.optional().default(1), {
    description: '페이지 번호',
    example: 1,
  }),
  take: extendApi(positiveSchema.optional().default(10), {
    description: '페이지당 항목 수',
    example: 10,
  }),
});

export class PaginationOptionsBaseDto extends createZodDto(
  paginationOptionsSchema,
) {}

export class PaginationOptionsDto extends createZodDto(
  paginationOptionsSchema,
) {
  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
