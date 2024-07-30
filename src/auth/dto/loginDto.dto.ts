import { ApiProperty } from '@nestjs/swagger';


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