import { IsString, IsNotEmpty, IsEmail, IsNumber, IsArray } from 'class-validator';
import { User } from '../entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';

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

    @IsArray()
    roles: Role[];

    constructor();

    constructor(user : User);

    constructor(user? : User){
        if(user){
            this.id = user.id;
            this.username = user.username;
            this.email = user.email;
            this.name = user.name;
            this.lastName = user.lastName;
            this.roles = user.roles;
        }
    }
}