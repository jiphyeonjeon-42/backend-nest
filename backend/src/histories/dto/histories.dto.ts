import { createZodDto } from 'nestjs-zod';
import { getHistoriesSchema } from '../schema/histories.schema';

export class getHistoriesDto extends createZodDto(getHistoriesSchema) {}
