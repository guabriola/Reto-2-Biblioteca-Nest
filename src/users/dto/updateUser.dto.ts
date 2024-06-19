import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {

    @IsString()
    @IsOptional()
    readonly username: string;

    @IsEmail()
    @IsOptional()
    readonly email: string;

    // @IsString()
    // @IsOptional()
    // readonly password: string;
    
    @IsString()
    @IsOptional()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly lastName: string;

}