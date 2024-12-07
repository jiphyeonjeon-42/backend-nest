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
  CreateUsersRequestDto,
  GetAPIVersionResponseDto,
  GetUserResponseDto,
  GetUsersRequestDto,
  GetUsersResponseDto,
  MyUpddateUsersRequestDto,
  UpdateUsersRequestDto,
  UpdateUsersResponseDto,
} from './dto/users.dto';
import { PaginationDto } from 'src/common/dto/dto';
import { UsersService } from './users.service';
import {
  getUserRequestSchema,
  getUsersRequestSchema,
  getUsersResponseArraySchema,
  getUsersResponseInnerSchema,
  getUsersResponseSchema,
  UserInclude,
} from './schema/users.schema';
import { z } from 'zod';
import { findOneSchema } from 'src/common/schema/schema';
import { paginate } from 'src/common/utils/paginate.utils';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get('search')
  // @ApiOperation({
  //   summary: 'Search users',
  //   description: '검색할 유저의 nickname or email',
  //   deprecated: true,
  //   tags: ['users'],
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '검색 결과를 반환한다.',
  //   type: GetUsersRequestDto,
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: '입력된 인자가 부적절합니다',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         properties: {
  //           errorCode: {
  //             type: 'number',
  //             description: '에러코드',
  //             example: 200,
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: '',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         properties: {
  //           errorCode: { type: 'number', description: '에러코드', example: 1 },
  //         },
  //       },
  //     },
  //   },
  // })
  // async getUsersDeprecated(@Query() getUsersRequestDto: GetUsersRequestDto) {}

  // @Get()
  // @ApiOperation({
  //   summary: 'Search users',
  //   description: '검색할 유저의 nickname or email',
  //   tags: ['users'],
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '검색 결과를 반환한다.',
  //   type: GetUsersRequestDto,
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: '입력된 인자가 부적절합니다',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         properties: {
  //           errorCode: {
  //             type: 'number',
  //             description: '에러코드',
  //             example: 200,
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: '',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         properties: {
  //           errorCode: { type: 'number', description: '에러코드', example: 1 },
  //         },
  //       },
  //     },
  //   },
  // })
  // async getUsers(@Query() getUsersRequestDto: GetUsersRequestDto) {}

  // @Post('create')
  // @ApiOperation({
  //   summary: 'Create users',
  //   description: '유저를 생성한다.',
  //   deprecated: true,
  //   tags: ['users'],
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '유저 생성 성공!',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Client Error Bad Request',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         properties: {
  //           errorCode: {
  //             type: 'number',
  //             description: '에러코드',
  //             example: 200,
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // async createUsersDeprecated(
  //   @Body() createUsersRequestDto: CreateUsersRequestDto,
  // ) {}

  // @Post()
  // @ApiOperation({
  //   summary: 'Create users',
  //   description: '유저를 생성한다.',
  //   tags: ['users'],
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '유저 생성 성공!',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Client Error Bad Request',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         properties: {
  //           errorCode: {
  //             type: 'number',
  //             description: '에러코드',
  //             example: 200,
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // async createUsers(@Body() createUsersRequestDto: CreateUsersRequestDto) {}

  // @Post('update/:id')
  // @ApiOperation({
  //   description: '유저 정보를 변경한다.',
  //   deprecated: true,
  //   tags: ['users'],
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '유저 정보 수정 성공!',
  //   type: UpdateUsersResponseDto,
  // })
  // async updateUsersDeprecated(
  //   @Param('id') id: string,
  //   @Body() updateUsersRequestDto: UpdateUsersRequestDto,
  // ) {}

  // @Post(':id')
  // @ApiOperation({
  //   description: '유저 정보를 변경한다.',
  //   tags: ['users'],
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '유저 정보 수정 성공!',
  //   type: UpdateUsersResponseDto,
  // })
  // async updateUsers(
  //   @Param('id') id: string,
  //   @Body() updateUsersRequestDto: UpdateUsersRequestDto,
  // ) {}

  // @Patch('myupdate')
  // @ApiOperation({
  //   description: '내 유저정보를 변경한다.',
  //   deprecated: true,
  //   tags: ['users'],
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '유저 정보 변경 성공!',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: '들어온 인자가 없습니다..',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         properties: {
  //           errorCode: {
  //             type: 'number',
  //             description: '에러코드',
  //             example: 200,
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 403,
  //   description: '수정하려는 계정이 본인의 계정이 아닙니다',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         description: 'error description',
  //         properties: {
  //           errorCode: {
  //             type: 'number',
  //             description: '에러코드',
  //             example: 206,
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 409,
  //   description: '수정하려는 값이 중복됩니다',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         description: '203, 204 에러',
  //         properties: {
  //           errorCode: {
  //             type: 'number',
  //             description: '에러코드',
  //             example: 204,
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Server Error',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         description: 'error description',
  //         properties: {
  //           errorCode: {
  //             type: 'number',
  //             description: '에러코드',
  //             example: 1,
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // async myUpdateUsersDeprecated(
  //   @Body() myUpddateUsersRequestDto: MyUpddateUsersRequestDto,
  // ) {}

  // @Patch('/me')
  // @ApiOperation({
  //   description: '내 유저정보를 변경한다.',
  //   tags: ['users'],
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '유저 정보 변경 성공!',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: '들어온 인자가 없습니다..',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         properties: {
  //           errorCode: {
  //             type: 'number',
  //             description: '에러코드',
  //             example: 200,
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 403,
  //   description: '수정하려는 계정이 본인의 계정이 아닙니다',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         description: 'error description',
  //         properties: {
  //           errorCode: {
  //             type: 'number',
  //             description: '에러코드',
  //             example: 206,
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 409,
  //   description: '수정하려는 값이 중복됩니다',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         description: '203, 204 에러',
  //         properties: {
  //           errorCode: {
  //             type: 'number',
  //             description: '에러코드',
  //             example: 204,
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Server Error',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         description: 'error description',
  //         properties: {
  //           errorCode: {
  //             type: 'number',
  //             description: '에러코드',
  //             example: 1,
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // async myUpdateUsers(
  //   @Body() myUpddateUsersRequestDto: MyUpddateUsersRequestDto,
  // ) {}

  // @Get('EasterEgg') // suggesting to change this to 'version'
  // @ApiOperation({
  //   description: '집현전 개발 버전을 확인합니다.',
  //   tags: ['users'],
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '집현전 개발 버전을 반환합니다.',
  //   type: GetAPIVersionResponseDto,
  // })
  // async getVersion() {}

  // @Get('me')
  // @ApiOperation({
  //   description: '내 정보를 조회합니다.',
  //   tags: ['users'],
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '내 정보를 반환합니다.',
  //   type: UpdateUsersResponseDto,
  // })
  // async getMyUserInfo() {}

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
    @Param('id') id: string,
    @Query('include') include?: string[],
  ): Promise<GetUserResponseDto> {
    const paramResult = findOneSchema.safeParse(id);
    const includeResult = getUserRequestSchema.safeParse({ include });
    if (!includeResult.success || !paramResult.success) {
      throw new BadRequestException();
    }
    const numId = paramResult.data;
    const includeData = includeResult.data;
    const responseDTO = await this.usersService.findOne(
      numId,
      includeData.include,
    );
    if (!responseDTO) {
      throw new NotFoundException();
    }
    const responseResult = getUsersResponseInnerSchema.safeParse(responseDTO);
    if (!responseResult.success) {
      throw new InternalServerErrorException();
    }
    return responseResult.data;
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
    @Query() query?: GetUsersRequestDto,
  ): Promise<PaginationDto<GetUsersResponseDto>> {
    const requestResult = getUsersRequestSchema.safeParse(query);

    if (!requestResult.success) {
      throw new BadRequestException();
    }
    const requestQuery = requestResult.data;
    const [users, count] = await this.usersService.findAll(requestQuery);
    const responseResult = getUsersResponseSchema.safeParse(users);

    if (!responseResult.success) {
      throw new InternalServerErrorException();
    }
    return await paginate(
      responseResult.data,
      count,
      requestQuery.page,
      requestQuery.limit,
    );
  }
}
