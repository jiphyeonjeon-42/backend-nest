import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HistoriesService } from 'src/service/histories.service';

@Controller('histories')
export class HistoriesController {
  constructor(private historiesService: HistoriesService) {}

  @Get()
  @ApiOperation({
    summary: '모든 히스토리를 반환합니다.',
    description: '모든 히스토리를 반환합니다.',
  })
  @ApiParam({ name: 'name', description: '이름', example: 'Nest' })
  @ApiResponse({ status: 200, description: '성공', example: 'Hello Nest' })
  getHistories() {
    return this.historiesService.getHistories();
  }
}
