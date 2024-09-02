import { Inject, Injectable } from '@nestjs/common';
import { HistoriesRepository } from 'src/repository/histories.repository';

@Injectable()
export class HistoriesService {
  constructor(
    @Inject('HistoriesRepository')
    private historiesRepository: HistoriesRepository,
  ) {}

  async getHistories() {
    return await this.historiesRepository.getHistories();
  }
}
