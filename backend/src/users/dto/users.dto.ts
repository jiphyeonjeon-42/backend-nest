import { createZodDto } from '@anatine/zod-nestjs';
import {
  createUsersRequestSchema,
  getAPIVersionResponseSchema,
  getMyUserInfoResponseSchema,
  getUsersRequestSchema,
  getUsersResponseSchema,
  myUpdateUsersRequestSchema,
  updateUsersParamSchema,
  updateUsersRequestSchema,
  updateUsersResponseSchema,
} from '../schema/users.schema';

export class GetUsersRequestDto extends createZodDto(getUsersRequestSchema) {}

export class GetUsersResponseDto extends createZodDto(getUsersResponseSchema) {}

export class CreateUsersRequestDto extends createZodDto(
  createUsersRequestSchema,
) {}

export class UpdateUsersParamDto extends createZodDto(updateUsersParamSchema) {}

export class UpdateUsersRequestDto extends createZodDto(
  updateUsersRequestSchema,
) {}

export class UpdateUsersResponseDto extends createZodDto(
  updateUsersResponseSchema,
) {}

export class MyUpddateUsersRequestDto extends createZodDto(
  myUpdateUsersRequestSchema,
) {}

export class GetAPIVersionResponseDto extends createZodDto(
  getAPIVersionResponseSchema,
) {}

export class GetMyUserInfoResponseDto extends createZodDto(
  getMyUserInfoResponseSchema,
) {}
