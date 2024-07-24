import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  /**
 * At least 6 characters
 * @example 'jhondoe'
 */
  username: string;

    /**
 * At least 6 characters
 * @example 'password123'
 */
  password: string;
}