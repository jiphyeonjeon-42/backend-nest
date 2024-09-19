import { Module } from '@nestjs/common';
import { HistoriesService } from 'src/histories/histories.service';
import { historiesProviders } from './histories.providers'; // Import the 'historiesProviders' variable from the correct file
import { TypeOrmModule } from '@nestjs/typeorm';
import { VHistories } from 'src/entities/VHistories';
import { HistoriesController } from 'src/histories/histories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VHistories])],
  providers: [...historiesProviders, HistoriesService],
  controllers: [HistoriesController],
})
export class HistoriesModule {}
