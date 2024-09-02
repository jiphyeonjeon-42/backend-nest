import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoriesController } from './controller/histories.controller';
import { HistoriesService } from './service/histories.service';

@Module({
  imports: [],
  controllers: [AppController, HistoriesController],
  providers: [AppService, HistoriesService],
})
export class AppModule {}
