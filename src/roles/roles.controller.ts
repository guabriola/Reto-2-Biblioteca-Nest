import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { HasRoles } from 'src/common/decorators/has.roles.decorator';

//For this project the only roles will be ADMIN and USER - If is neccesary have another 
//role it must be done by the developer.
//IF in the future is necesary, it can be add POST PUT and Delete controllers.
@UseGuards(ThrottlerGuard, RolesGuard) //Applying Rate Limiting And RolesGuard
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Find all Roles
   * @returns Roles Array
   */
  @ApiBearerAuth()
  @HasRoles('ADMIN')
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  /**
   * Find Role By ID
   * @param id 
   * @returns 
   */
  @ApiBearerAuth()
  @HasRoles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOneByID(+id);
  }

  /**
   * Finde Role by role name
   * @param roleName 
   * @returns 
   */
  @ApiBearerAuth()
  @HasRoles('ADMIN')
  @Get('/byRoleName/:roleName')
  findByRoleNAme(@Param('roleName') roleName: string): Promise<Role>{
    return this.rolesService.findOneByRoleName(roleName);
  }

}
