import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoriesModule } from './histories/histories.module';
import { BooksModule } from './books/books.module';
import { typeOrmModuleOptions } from './database/config';
import { UsersModule } from './users/users.module';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    HistoriesModule,
    UsersModule,
    BooksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
