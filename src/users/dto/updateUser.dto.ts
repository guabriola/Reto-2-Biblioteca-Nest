import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {

    @IsString()
    @IsOptional()
    username: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    password: string;
    
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    lastName: string;

}