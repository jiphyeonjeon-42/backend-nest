import { Inject, Injectable } from '@nestjs/common';
import { HistoriesRepository } from 'src/repository/histories.repository';

@Injectable()
export class HistoriesService {
  constructor(
    @Inject()
    private historiesRepository: HistoriesRepository,
  ) {}

  async getHistories() {
    return await this.historiesRepository.getHistories();
  }
}
