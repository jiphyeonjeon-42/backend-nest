import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserReservation, VLendingForSearchUser } from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, VLendingForSearchUser, UserReservation]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
