import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoriesController } from './controller/histories.controller';

@Module({
  imports: [],
  controllers: [AppController, HistoriesController],
  providers: [AppService],
})
export class AppModule {}
