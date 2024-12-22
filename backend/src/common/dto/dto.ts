import { createZodDto } from '@anatine/zod-nestjs';
import {
  findOneSchema,
  paginationRequestSchema,
  paginationMetaSchema,
} from '../schema/schema';

class PaginationMetaDto extends createZodDto(paginationMetaSchema) {}

export class PaginationDto<Tdata> {
  data: Tdata;
  meta: PaginationMetaDto;
}
