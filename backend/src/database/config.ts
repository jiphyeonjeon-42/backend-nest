import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const dbConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + '/entities/*{.ts,.js}'],
  migrations: [__dirname + '/migrate/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
};

// TypeOrmModuleOptions 는 extends Partial<DataSourceOptions>
export const typeOrmModuleOptions: TypeOrmModuleOptions = dbConfig;

export const dataSource: DataSource = new DataSource(dbConfig);
