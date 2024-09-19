import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VHistories } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class HistoriesService {
  constructor(
    @InjectRepository(VHistories)
    private historiesRepository: Repository<VHistories>,
  ) {}

  async getHistories() {
    return await this.historiesRepository.find();
  }
}
