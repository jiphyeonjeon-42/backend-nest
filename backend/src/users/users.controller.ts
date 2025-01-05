import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
  GetUserRequestDto,
  GetUserResponseDto,
  GetUsersRequestDto,
  GetUsersResponseDto,
  IdDto,
  UpdateUsersRequestDto,
} from './dto/users.dto';
import { UsersService } from './users.service';
import {
  createUserResponseSchema,
  getUsersResponseInnerSchema,
  getUsersResponseSchema,
  UserInclude,
} from './schema/users.schema';
import { User } from 'src/database/entities';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * API 분리 GET /users/search 에 id query fineOne으로 변경
   *
   * @param params
   */
  @ApiOperation({ summary: '유저 retrieve' })
  @ApiOkResponse({ type: GetUserResponseDto })
  @ApiQuery({
    name: 'include',
    required: false,
    description:
      'lendings 와 reservations 정보를 가져올지 여부를 결정합니다. (e.g., lendings, reservations) lendings 를 가져올시 overDueDay 를 계산하여 반환합니다.',
    enum: UserInclude, // This validates the query against the enum
    isArray: true, // Indicates the query can be passed multiple times
    example: ['lendings', 'reservations'],
  })
  @Get(':id')
  async findOne(
    @Param() { id }: IdDto,
    @Query() query: GetUserRequestDto,
  ): Promise<GetUserResponseDto> {
    const user = await this.usersService.findOne(id, query.include);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Get()
  @ApiOperation({ summary: '유저 list' })
  @ApiOkResponse({ type: GetUsersResponseDto })
  @ApiQuery({
    name: 'include',
    required: false,
    description:
      'lendings 와 reservations 정보를 가져올지 여부를 결정합니다. (e.g., lendings, reservations) lendings 를 가져올시 overDueDay 를 계산하여 반환합니다.',
    enum: UserInclude, // This validates the query against the enum
    isArray: true, // Indicates the query can be passed multiple times
    example: ['lendings', 'reservations'],
  })
  async findAll(
    @Query() query: GetUsersRequestDto,
  ): Promise<GetUsersResponseDto> {
    // Fetch user data
    const [users, count] = await this.usersService.findAll(query);
    return {
      items: users,
      meta: {
        itemCount: users.length,
        currentPage: query.page,
        itemsPerPage: query.take,
        totalItems: count,
        totalPages: Math.ceil(count / query.take),
      },
    };
  }

  // @Get('me')
  // @ApiOperation({ summary: '내 정보 조회' })
  // async findMe(
  //   @Query('include') include?: string[],
  // ): Promise<GetUserResponseDto> {
  //   // Validate request
  //   const includeResult = getUserRequestSchema.safeParse({ include });
  //   if (!includeResult.success) {
  //     throw new BadRequestException();
  //   }
  //   const includeData = includeResult.data;

  //   // Fetch user data
  //   const responseDTO = await this.usersService.findMe(includeData);

  //   const responseResult = getUsersResponseInnerSchema.safeParse(responseDTO);
  //   if (!responseResult.success) {
  //     throw new InternalServerErrorException();
  //   }
  //   return responseResult.data;
  // }

  @Post()
  @ApiOperation({ summary: '유저 생성' })
  @ApiResponse({ status: 201, description: '유저 생성 성공' })
  async create(
    @Body() requestBody: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const { email, password } = requestBody;
    // Create user
    try {
      return await this.usersService.createUser(email, password);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: '유저 정보 수정' })
  @ApiResponse({ status: 200, description: '유저 정보 수정 성공' })
  async update(
    @Param('id') { id }: IdDto,
    @Query() query: UpdateUsersRequestDto,
  ): Promise<User> {
    // Check if all fields are missing
    const isAllMissing = Object.keys(query).length === 0;
    if (isAllMissing) {
      throw new BadRequestException();
    }

    // Update user
    try {
      return await this.usersService.updateUser(id, query);
    } catch (error) {
      throw error;
    }
  }

  @Patch('myupdate')
  @ApiOperation({ summary: '로그인된 유저 정보 수정' })
  @ApiResponse({ status: 200, description: '유저 정보 수정 성공' })
  async updateMyself(@Query() query: UpdateUsersRequestDto): Promise<User> {
    // Check if all fields are missing
    const isAllMissing = Object.keys(query).length === 0;
    if (isAllMissing) {
      throw new BadRequestException();
    }

    const numId = 1; // TODO: Get user id from token
    // Update user
    try {
      return await this.usersService.updateUser(numId, query);
      // Validate response
    } catch (error) {
      throw error;
    }
  }
}
