import { Controller, Get } from '@nestjs/common';

@Controller('histories')
export class HistoriesController {
  @Get()
  getHistories(): string {
    return 'Histories';
  }
}
