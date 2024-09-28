import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Add this line
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoriesModule } from './histories/histories.module';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.RDS_HOSTNAME,
      port: 3306,
      username: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DB_NAME,
      entities: [__dirname + '/**/*{.ts,.js}'],
      synchronize: false,
    }),
    HistoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
