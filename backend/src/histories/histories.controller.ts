import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HistoriesService } from 'src/histories/histories.service';
import { getHistoriesDto } from 'src/histories/dto/histories.dto'; // Adjust the import path as necessary

@Controller('histories')
export class HistoriesController {
  constructor(private historiesService: HistoriesService) {}

  @Get()
  @ApiOperation({
    summary: '대출 기록 조회',
    description:
      '현재까지의 대출 기록을 최신순으로 가져온다. 사서라면 모든 사용자의 기록을, 사서가 아니라면 본인의 기록만 볼 수 있다.',
    tags: ['histories'],
  })
  @ApiResponse({
    status: 200,
    description: '대출 기록을 반환한다.',
    schema: {
      type: 'object',
      properties: {
        items: {
          description: '검색된 대출 기록들의 목록',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                description: '대출 기록의 고유 id',
                type: 'integer',
              },
              lendingCondition: {
                description: '대출 시 책 상태',
                type: 'string',
              },
              login: {
                description: '대출한 사용자의 로그인 id',
                type: 'string',
              },
              returningCondition: {
                description: '반납 시 책 상태',
                type: 'string',
              },
              penaltyDays: {
                description: '연체일 수',
                type: 'integer',
              },
              callSign: {
                description: '책 청구기호',
                type: 'string',
              },
              title: {
                description: '책 제목',
                type: 'string',
              },
              bookInfoId: {
                description: 'book_info 테이블의 고유 id',
                type: 'integer',
              },
              createdAt: {
                description: 'lending 테이블의 데이터 생성 시각',
                type: 'string',
              },
              returnedAt: {
                description: '반납 일시',
                type: 'Date',
              },
              dueDate: {
                description: '반납 기한',
                type: 'Date',
              },
              lendingLibrarianNickName: {
                description: '대출해준 사서의 이름',
                type: 'string',
              },
              returningLibrarianNickName: {
                description: '반납해준 사서의 이름',
                type: 'string',
              },
              image: {
                description: '책의 이미지 주소',
                type: 'string',
              },
            },
          },
        },
      },
    },
  })
  getHistories(@Query() query: getHistoriesDto) {
    return this.historiesService.getHistories();
  }
}
