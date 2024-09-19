import { zip } from "rxjs";
import { z } from 'nestjs-zod/z';
import { createZodDto } from "nestjs-zod";

export const createReviewsSchema = z.object({
	bookInfoId: z.coerce.number(),
	content: z.string(),
});

export class CreateReviewsDto extends createZodDto(createReviewsSchema) {}

export const getReviewsSchema = z.object({
	titleOrNickname: z.string(),
	page: z.coerce.number().optional(),
	disabled: z.coerce.number(),
	limit: z.coerce.number().optional(),
	sort: z.string().optional(), 
});

export class GetReviewsDto extends createZodDto(getReviewsSchema) {}