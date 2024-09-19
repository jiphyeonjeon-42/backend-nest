import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateReviewsDto } from 'src/dto/reviews.dto';
import { HistoriesService } from 'src/service/histories.service';

@Controller('reviews')
export class ReviewsController {
  constructor() {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '책 리뷰를 작성한다.' })
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
  createReviews(@Body() createReviewsDto: CreateReviewsDto) {

  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '책 리뷰 10개를 반환한다.' })
  @ApiResponse({
    status: 200,
    description: '리뷰 목록과 메타데이터를 반환합니다.',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              reviewsId: { type: 'number' },
              reviewerId: { type: 'number' },
              bookInfoId: { type: 'number' },
              content: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              title: { type: 'string' },
              nickname: { type: 'string' },
              intraId: { type: 'string' },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            totalItems: { type: 'number' },
            itemCount: { type: 'number' },
            itemsPerPage: { type: 'number' },
            totalPages: { type: 'number' },
            currentPage: { type: 'number' },
            finalPage: { type: 'boolean' },
          },
        },
      },
    },
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
  getReviews() {

  }

  @Get('my-reviews')
  getMyReviews() {

  }

  @Put(':reviewsId')
  putMyReviews() {

  }

  @Patch(':reviewsId')
  PatchMyReviews() {

  }

  @Delete(':reviewsId')
  deleteMyReviews() {
    
  }
  
}