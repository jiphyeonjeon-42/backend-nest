import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lending, Reservation, User } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Lending, Reservation])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
