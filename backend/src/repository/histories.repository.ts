import { Injectable } from '@nestjs/common';
import { VHistories } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class HistoriesRepository {
  private readonly historiesRepository: Repository<VHistories>;

  constructor() {
    // constructor logic here
  }

  async getHistories(): Promise<VHistories[]> {
    return this.historiesRepository.find();
  }
}
