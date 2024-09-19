import { createZodDto } from 'nestjs-zod';
import { getHistoriesRequestSchema } from '../schema/histories.schema';

export class getHistoriesDto extends createZodDto(getHistoriesRequestSchema) {}
