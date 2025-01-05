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
  lendingsForSearchUser,
  myUpdateUsersRequestSchema,
  updateUsersRequestSchema,
  updateUsersResponseSchema,
  userReservations,
} from '../schema/users.schema';
import { PaginationOptionsBaseDto } from 'src/common/dtos/page-options.dto';

export function PaginationMixin<
  TBase extends new (...args: any[]) => PaginationOptionsBaseDto,
>(Base: TBase) {
  return class extends Base {
    get skip(): number {
      return (this.page - 1) * this.take;
    }
  };
}

export class IdDto extends createZodDto(idSchema) {}

export class GetUserRequestDto extends createZodDto(getUserRequestSchema) {}

export class GetUserResponseDto extends createZodDto(
  getUsersResponseInnerSchema,
) {}

export class GetUsersRequestDto extends PaginationMixin(
  createZodDto(getUsersRequestSchema),
) {}

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

export class UserReservationsDto extends createZodDto(userReservations) {}

export class LendingsForSearchUserDto extends createZodDto(
  lendingsForSearchUser,
) {}
