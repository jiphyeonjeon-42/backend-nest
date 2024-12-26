import { createZodDto } from '@anatine/zod-nestjs';
import {
  createUserRequestSchema,
  createUserResponseSchema,
  getAPIVersionResponseSchema,
  getMyUserInfoResponseSchema,
  getUserRequestSchema,
  getUsersRequestSchema,
  getUsersResponseInnerSchema,
  getUsersResponseSchema,
  idSchema,
  myUpdateUsersRequestSchema,
  updateUsersRequestSchema,
  updateUsersResponseSchema,
} from '../schema/users.schema';

// export class GetUserRequestDto extends createZodDto(updateUsersParamSchema) {}

export class IdDto extends createZodDto(idSchema) {}

export class GetUserRequestDto extends createZodDto(getUserRequestSchema) {}

export class GetUserResponseDto extends createZodDto(
  getUsersResponseInnerSchema,
) {}

export class GetUsersRequestDto extends createZodDto(getUsersRequestSchema) {}

export class GetUsersResponseDto extends createZodDto(getUsersResponseSchema) {}

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

export class CreateUserResponseDto extends createZodDto(
  createUserResponseSchema,
) {}

export class CreateUserRequestDto extends createZodDto(
  createUserRequestSchema,
) {}
