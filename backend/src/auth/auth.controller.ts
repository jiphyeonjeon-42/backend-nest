import { createZodDto } from '@anatine/zod-nestjs';
import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiFoundResponse,
  ApiGoneResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { z } from 'zod';

const locationSchema = z.string().url();

const errorSchema = z.object({
  code: z.number(),
  message: z.string(),
});
class ErrorResponseDto extends createZodDto(errorSchema) {}

const userSchema = z.object({
  id: z.number().describe('로그인한 유저의 PK'),
  intra: z.string().describe('인트라 아이디 (인트라아이디가 없다면 email)'),
  librarian: z.boolean().describe('사서 여부'),
  email: z.string().email(),
});
class UserResponseDto extends createZodDto(userSchema) {}

const loginSchema = z.object({
  id: z.string(),
  password: z.string(),
});
class LoginDto extends createZodDto(loginSchema) {}

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor() {}

  @Get('oauth')
  @ApiOperation({
    summary: '42 Api에 API key값을 추가해서 요청합니다.',
    description:
      '42 Api에 API key값을 추가해서 요청합니다. redirect 되기에 반환값을 확인할 수 없습니다.',
  })
  @ApiFoundResponse({
    description: '정상적으로 42 Api로 이동합니다.',
    headers: {
      Location: {
        description: '42 Api 주소로 이동합니다.',
        schema: { type: 'string', format: 'uri' },
      },
    },
  })
  async oauth() {}

  @Get('token')
  @ApiOperation({
    summary: '42 OAuth Api의 반환값을 이용하여 토큰을 발급합니다.',
    description:
      '42 OAuth Api의 반환값을 이용하여 토큰을 발급합니다. redirect 되기에 반환값을 확인할 수 없습니다.',
  })
  @ApiFoundResponse({
    description: '성공적으로 토큰 발급',
    headers: {
      Location: {
        description:
          '브라우저에 유저정보를 저장 하는 frontend /auth 주소로 이동',
        schema: { type: 'string', format: 'uri' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description:
      '42 api와 연동된 ID가 없음, [front에서 알림 후 회원가입창으로 이동]',
    type: ErrorResponseDto,
  })
  async token() {}

  @Get('me')
  @ApiOperation({
    summary: '클라이언트의 로그인된 유저 정보를 받아옵니다.',
    description: '클라이언트의 로그인된 유저 정보를 받아옵니다.',
  })
  @ApiFoundResponse({
    description: '로그인 되어 있는 유저의 정보를 반환합니다.',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '토큰이 없을 경우 에러',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '권한이 맞지 않을때 에러',
    type: ErrorResponseDto,
  })
  @ApiGoneResponse({
    description: '해당 토큰의 유저가 DB에 없을 경우의 에러',
    type: ErrorResponseDto,
  })
  async me() {}

  @Post('login')
  @ApiOperation({
    summary: '로그인',
    description:
      '입력된 회원정보를 Users DB에서 확인하여, Token을 발급해 쿠키에 저장해줍니다.',
  })
  @ApiNoContentResponse({
    description: '성공적으로 토큰 발급',
  })
  @ApiUnauthorizedResponse({
    description: 'ID를 찾을 수 없는 경우',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'PW가 틀린 경우',
    type: ErrorResponseDto,
  })
  async login(@Body() { id, password }: LoginDto) {}

  @Post('logout')
  @ApiOperation({
    summary: '로그아웃',
    description: '발급한 token을 소멸시킵니다.',
  })
  @ApiNoContentResponse({
    description: '정상적으로 token 삭제 완료',
  })
  async logout() {}

  @Get('getIntraAuthentication')
  @ApiOperation({
    summary: '42 intra에 접근합니다.',
    description: 'redirect 되어 들어오기에 반환값을 확인할 수 없습니다.',
  })
  @ApiFoundResponse({
    description: '성공적으로 토큰 발급',
    headers: {
      Location: {
        description:
          '브라우저에 유저정보를 저장 하는 frontend /auth 주소로 이동',
        schema: { type: 'string', format: 'uri' },
      },
    },
  })
  getIntraAuthentication() {}

  @Get('intraAuthentication')
  @ApiOperation({
    summary: '42 intra 인증을 실시합니다.',
    description: 'redirect 되어 들어오기에 반환값을 확인할 수 없습니다.',
  })
  @ApiFoundResponse({
    description: '성공적으로 토큰 발급',
    headers: {
      Location: {
        description:
          '브라우저에 유저정보를 저장 하는 frontend /auth 주소로 이동',
        schema: { type: 'string', format: 'uri' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'ID, PW 값이 없는 잘못된 요청',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '토큰이 없을 경우, 이미 인증된 회원의 경우',
    type: ErrorResponseDto,
  })
  @ApiGoneResponse({
    description: '해당 토큰의 유저가 DB에 없을 경우의 에러',
    type: ErrorResponseDto,
  })
  intraAuthentication() {}
}
