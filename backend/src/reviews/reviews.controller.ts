import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CreateReviewsRequestDto,
  GetReviewsRequestDto,
  GetReviewsResponseDto,
} from './dto/reviews.dto';

@Controller('reviews')
export class ReviewsController {
  constructor() {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '책 리뷰를 작성한다.',
    description:
      '책 리뷰를 작성한다. content 길이는 10글자 이상 420글자 이하로 입력하여야 한다.',
    tags: ['reviews'],
  })
  @ApiResponse({
    status: 201,
    description: '리뷰가 DB에 정상적으로 insert됨.',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청.',
    schema: {
      type: 'object',
      example: {
        errorCode: 801,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '권한 없음.',
    schema: {
      type: 'object',
      oneOf: [
        { example: { errorCode: 100 } }, // 토큰 누락
        { example: { errorCode: 101 } }, // 토큰 유저 존재하지 않음
        { example: { errorCode: 108 } }, // 토큰 만료
        { example: { errorCode: 109 } }, // 토큰 유효하지 않음
      ],
    },
  })
  createReviews(@Body() createReviewsDto: CreateReviewsRequestDto) {
  
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '책 리뷰 10개를 반환한다.',
    description:
      '책 리뷰 10개를 반환한다. 최종 페이지의 경우 1 <= n <= 10 개의 값이 반환될 수 있다. content에는 리뷰에 대한 정보를, finalPage 에는 해당 페이지가 마지막인지에 대한 여부를 boolean 값으로 반환한다.',
    tags: ['reviews'],
  })
  @ApiResponse({
    status: 200,
    description: '리뷰 목록과 메타데이터를 반환합니다.',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청.',
    schema: {
      type: 'object',
      oneOf: [
        { example: { errorCode: 2 } }, // 적절하지 않는 bookInfoId 값
        { example: { errorCode: 2 } }, // 적절하지 않는 userId 값
        { example: { errorCode: 2 } }, // 적절하지 않는 page 값
        { example: { errorCode: 2 } }, // 적절하지 않는 sort 값
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: '권한 없음.',
    schema: {
      type: 'object',
      oneOf: [
        { example: { errorCode: 100 } }, // 토큰 누락
        { example: { errorCode: 100 } }, // 사서 권한 없음
        { example: { errorCode: 101 } }, // 토큰 유저 존재하지 않음
        { example: { errorCode: 108 } }, // 토큰 만료
        { example: { errorCode: 109 } }, // 토큰 유효하지 않음
      ],
    },
  })
  getReviews(@Param() getReviewsRequestDto: GetReviewsRequestDto) {}

  @Get('my-reviews')
  getMyReviews() {}

  @Put(':reviewsId')
  putMyReviews() {}

  @Patch(':reviewsId')
  PatchMyReviews() {}

  @Delete(':reviewsId')
  deleteMyReviews() {}
}
