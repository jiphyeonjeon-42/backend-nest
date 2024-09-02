import { Controller, Get } from '@nestjs/common';
import { HistoriesService } from 'src/service/histories.service';

@Controller('histories')
export class HistoriesController {
  constructor(private historiesService: HistoriesService) {}

  @Get()
  getHistories(): string {
    return this.historiesService.getHistories();
  }
}
