import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/entities/role.enum';


export const HasRoles = (...roles: Role[]) => SetMetadata('roles', roles);