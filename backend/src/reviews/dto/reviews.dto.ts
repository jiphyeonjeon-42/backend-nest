import { createZodDto } from '@anatine/zod-nestjs';
import {
  createReviewsRequestSchema,
  deleteReviewsPathSchema,
  getMyReviewsRequestSchema,
  getMyReviewsResponseSchema,
  getReviewsRequestSchema,
  getReviewsResponseSchema,
  patchReviewsPathSchema,
  updateReviewsPathSchema,
  updateReviewsRequestSchema,
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

export class GetMyReviewsRequestDto extends createZodDto(
  getMyReviewsRequestSchema,
) {}

export class GetMyReviewsResponseDto extends createZodDto(
  getMyReviewsResponseSchema,
) {}

export class UpdateReviewsPathDto extends createZodDto(
  updateReviewsPathSchema,
) {}

export class UpdateReviewsRequestDto extends createZodDto(
  updateReviewsRequestSchema,
) {}

export class PatchReviewsPathDto extends createZodDto(patchReviewsPathSchema) {}

export class DeleteReviewsPathDto extends createZodDto(
  deleteReviewsPathSchema,
) {}
