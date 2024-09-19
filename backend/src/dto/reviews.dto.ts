import { zip } from "rxjs";
import { z } from 'nestjs-zod/z';
import { createZodDto } from "nestjs-zod";

export const createReviewsSchema = z.object({
	bookInfoId: z.coerce.number(),
	content: z.string(),
});

export class CreateReviewsDto extends createZodDto(createReviewsSchema) {}