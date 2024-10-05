import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Add this line
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoriesModule } from './histories/histories.module';
import { dbConfig } from './config';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), HistoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
