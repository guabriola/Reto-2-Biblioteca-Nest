import { IsString, IsDateString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
    
    @IsString()
    // @IsNotEmpty()
    name: string;

    @IsString()
    // @IsNotEmpty()
    lastName: string;

}