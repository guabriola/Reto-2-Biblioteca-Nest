import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) { }

  //Create Role
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.rolesRepository.create(createRoleDto);
    return await this.rolesRepository.save(role);
  }

  //Find all Roles
  async findAll(): Promise<Role[]> {
    return await this.rolesRepository.find();
  }

  //Find role by Id
  async findOneByID(reoleId: number): Promise<Role> {
    const role = await this.rolesRepository.findOne({ where: { id: reoleId } });
    if (role) {
      return role;
    } else throw new NotFoundException;
  }

  //Find role by role name
  async findOneByRoleName(roleName: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: {
        role: roleName,
      }
    })

    if (role) {
      return role;
    } else throw new NotFoundException;
  }

}