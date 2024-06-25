import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';
import { User } from '../entities/user.entity';

export class UserDto {

    @IsNumber()
    readonly id: number;

    @IsString()
    readonly username: string;

    @IsEmail()
    readonly email: string;
    
    @IsString()
    readonly name: string;

    @IsString()
    readonly lastName: string;

    constructor();

    constructor(user : User);

    constructor(user? : User){
        if(user){
            this.id = user.id;
            this.username = user.username;
            this.email = user.email;
            this.name = user.name;
            this.lastName = user.lastName;
        }
    }
}