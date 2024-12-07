import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoriesModule } from './histories/histories.module';
import { BooksModule } from './books/books.module';
import { dbConfig } from './config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), HistoriesModule, UsersModule, BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
