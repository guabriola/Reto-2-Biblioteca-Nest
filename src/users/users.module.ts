import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], //Make init.Service works 
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],//Make init.Service works 
})
export class UsersModule {}
