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