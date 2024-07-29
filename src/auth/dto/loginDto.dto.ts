import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/users/entities/role.enum';

export class LoginDto {
    /**
       * @example 'jhondoe'
       */
    username: string;

    /**
     * @example 'password123'
     */
    password: string;
}