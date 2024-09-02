import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoriesController } from './controller/histories.controller';
import { HistoriesService } from './service/histories.service';
import { HistoriesRepository } from './repository/histories.repository';

@Module({
  imports: [],
  controllers: [AppController, HistoriesController],
  providers: [AppService, HistoriesService, HistoriesRepository],
})
export class AppModule {}
