import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.rolesRepository.create(createRoleDto);
    return await this.rolesRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.rolesRepository.find();
  }

  async findOneByID(reoleId: number): Promise<Role> {
    return await this.rolesRepository.findOne({where:{id:reoleId}});
  }

  async findOneByRoleName(roleName: string): Promise<Role>{
    return await this.rolesRepository.findOne({
      where: {
        role: roleName,
      }
    })
  }
}