import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/roles/entities/role.entity';
export const HasRoles = (...roles: Role[]) => SetMetadata('roles', roles);