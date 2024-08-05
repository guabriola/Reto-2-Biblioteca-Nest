import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { RolesService } from 'src/roles/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])], //It's needed to use those repositories on user services. 
  controllers: [UsersController],
  providers: [UsersService, RolesService],
  exports: [UsersService],//Makes init.Service works 
})
export class UsersModule {}
