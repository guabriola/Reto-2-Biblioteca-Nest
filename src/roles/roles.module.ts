import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])], //Make init.Service works 
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],//Make init.Service works 
})
export class RolesModule {}
