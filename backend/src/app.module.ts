import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoriesModule } from './histories/histories.module';
import { BooksModule } from './books/books.module';
import { dbConfig } from './config';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), HistoriesModule, BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
