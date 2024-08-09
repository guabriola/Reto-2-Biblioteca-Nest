import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/common/decorators/has.roles.decorator';

//For this project the only roles will be ADMIN and USER - If is neccesary have another 
//role it must be done by the developer.
//IF in the future is necesary, it can be add POST PUT and Delete controllers.
@ApiTags('Roles')
@UseGuards(ThrottlerGuard, RolesGuard) //Applying Rate Limiting And RolesGuard
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Find all Roles
   */
  @ApiOperation({
    summary: 'Find all Roles - Access ADMIN',
  })
  @ApiBearerAuth()
  @HasRoles('ADMIN')
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  /**
   * Find Role By ID
   */
  @ApiOperation({
    summary: 'Find Role By ID - Access ADMIN',
  })
  @ApiBearerAuth()
  @HasRoles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOneByID(+id);
  }

  /**
   * Find Role by role name
   */
  @ApiOperation({
    summary: 'Find Role by role name - Access ADMIN',
  })
  @ApiBearerAuth()
  @HasRoles('ADMIN')
  @Get('/byRoleName/:roleName')
  findByRoleNAme(@Param('roleName') roleName: string): Promise<Role>{
    return this.rolesService.findOneByRoleName(roleName);
  }

}
