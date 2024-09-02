import { Injectable } from '@nestjs/common';

@Injectable()
export class HistoriesService {
  constructor() {}
  getHistories(): string {
    return 'Histories';
  }
}
