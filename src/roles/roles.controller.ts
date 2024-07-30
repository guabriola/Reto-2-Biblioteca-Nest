import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

//For this proyect the only roles will be ADMIN and USER - If is neccesary have another 
//role it must be done by de developer.
//IF in the future is necesary, it can be add POST PUT and Delete controllers.
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // @Post()
  // create(@Body() createRoleDto: CreateRoleDto) {
  //   return this.rolesService.create(createRoleDto);
  // }

  /**
   * Find all Roles
   * @returns Roles Array
   */
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  /**
   * Find Role By ID
   * @param id 
   * @returns 
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOneByID(+id);
  }

  /**
   * Finde Role by role name
   * @param roleName 
   * @returns 
   */
  @Get('/byRoleName/:roleName')
  findByRoleNAme(@Param('roleName') roleName: string): Promise<Role>{
    return this.rolesService.findOneByRoleName(roleName);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.rolesService.update(+id, updateRoleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rolesService.remove(+id);
  // }
}
