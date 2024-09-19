import { createZodDto } from '@anatine/zod-nestjs';
import {
  createReviewsRequestSchema,
  getReviewsRequestSchema,
  getReviewsResponseSchema,
} from '../schema/reviews.schema';

export class CreateReviewsRequestDto extends createZodDto(
  createReviewsRequestSchema,
) {}

export class GetReviewsRequestDto extends createZodDto(
  getReviewsRequestSchema,
) {}

export class GetReviewsResponseDto extends createZodDto(
  getReviewsResponseSchema,
) {}
