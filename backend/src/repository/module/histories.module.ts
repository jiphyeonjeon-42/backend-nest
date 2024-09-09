import { Module } from '@nestjs/common';
import { HistoriesService } from 'src/service/histories.service';
import { historiesProviders } from '../providers/histories.providers'; // Import the 'historiesProviders' variable from the correct file
import { TypeOrmModule } from '@nestjs/typeorm';
import { VHistories } from 'src/entities/VHistories';
import { HistoriesController } from 'src/controller/histories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VHistories])],
  providers: [...historiesProviders, HistoriesService],
  controllers: [HistoriesController],
})
export class HistoriesModule {}
