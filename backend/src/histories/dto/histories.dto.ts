import { createZodDto } from '@anatine/zod-nestjs';
import { getHistoriesRequestSchema } from '../schema/histories.schema';

export class getHistoriesDto extends createZodDto(getHistoriesRequestSchema) {}
