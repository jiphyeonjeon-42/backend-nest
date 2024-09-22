import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CreateUsersRequestDto,
  GetAPIVersionResponseDto,
  GetUsersRequestDto,
  MyUpddateUsersRequestDto,
  UpdateUsersRequestDto,
  UpdateUsersResponseDto,
} from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor() {}

  @Get('search')
  @ApiOperation({
    summary: 'Search users',
    description: '검색할 유저의 nickname or email',
    tags: ['users'],
  })
  @ApiResponse({
    status: 200,
    description: '검색 결과를 반환한다.',
    type: GetUsersRequestDto,
  })
  @ApiResponse({
    status: 400,
    description: '입력된 인자가 부적절합니다',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            errorCode: {
              type: 'number',
              description: '에러코드',
              example: 200,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: '',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            errorCode: { type: 'number', description: '에러코드', example: 1 },
          },
        },
      },
    },
  })
  async getUsers(@Query() getUsersRequestDto: GetUsersRequestDto) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create users',
    description: '유저를 생성한다.',
    tags: ['users'],
  })
  @ApiResponse({
    status: 200,
    description: '유저 생성 성공!',
  })
  @ApiResponse({
    status: 400,
    description: 'Client Error Bad Request',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            errorCode: {
              type: 'number',
              description: '에러코드',
              example: 200,
            },
          },
        },
      },
    },
  })
  async createUsers(@Body() createUsersRequestDto: CreateUsersRequestDto) {}

  @Post('update/:id')
  @ApiOperation({
    description: '유저 정보를 변경한다.',
    tags: ['users'],
  })
  @ApiResponse({
    status: 200,
    description: '유저 정보 수정 성공!',
    type: UpdateUsersResponseDto,
  })
  async updateUsers(
    @Param('id') id: string,
    @Body() updateUsersRequestDto: UpdateUsersRequestDto,
  ) {}

  @Patch('myupdate')
  @ApiOperation({
    description: '내 유저정보를 변경한다.',
    tags: ['users'],
  })
  @ApiResponse({
    status: 200,
    description: '유저 정보 변경 성공!',
  })
  @ApiResponse({
    status: 400,
    description: '들어온 인자가 없습니다..',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            errorCode: {
              type: 'number',
              description: '에러코드',
              example: 200,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '수정하려는 계정이 본인의 계정이 아닙니다',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          description: 'error description',
          properties: {
            errorCode: {
              type: 'number',
              description: '에러코드',
              example: 206,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: '수정하려는 값이 중복됩니다',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          description: '203, 204 에러',
          properties: {
            errorCode: {
              type: 'number',
              description: '에러코드',
              example: 204,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          description: 'error description',
          properties: {
            errorCode: {
              type: 'number',
              description: '에러코드',
              example: 1,
            },
          },
        },
      },
    },
  })
  async myUpdateUsers(
    @Body() myUpddateUsersRequestDto: MyUpddateUsersRequestDto,
  ) {}

  @Get('EasterEgg')
  @ApiOperation({
    description: '집현전 개발 버전을 확인합니다.',
    tags: ['users'],
  })
  @ApiResponse({
    status: 200,
    description: '집현전 개발 버전을 반환합니다.',
    type: GetAPIVersionResponseDto,
  })
  async getVersion() {}

  @Get('me')
  @ApiOperation({
    description: '내 정보를 조회합니다.',
    tags: ['users'],
  })
  @ApiResponse({
    status: 200,
    description: '내 정보를 반환합니다.',
    type: UpdateUsersResponseDto,
  })
  async getMyUserInfo() {}
}
