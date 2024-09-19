import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HistoriesService } from 'src/histories/histories.service';
import { getHistoriesDto } from 'src/histories/dto/histories.dto'; // Adjust the import path as necessary
import { getHistoriesResponseSchema } from './schema/histories.schema';

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
    schema: getHistoriesResponseSchema,
   })
  getHistories(@Query() query: getHistoriesDto) {
    return this.historiesService.getHistories();
  }
}
