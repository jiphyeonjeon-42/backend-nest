import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export const dbConfig = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [path.join(__dirname, '../**/dist/entities/*{.ts,.js}')],
  synchronize: false,
} satisfies TypeOrmModuleOptions;
