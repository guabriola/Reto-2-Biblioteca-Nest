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

    constructor();

    constructor(createUserDto : CreateUserDto);

    constructor(createUserDto? : CreateUserDto){
        if(createUserDto){
            this.username = createUserDto.username;
            this.email = createUserDto.email;
            this.password = createUserDto.password;
            this.name = createUserDto.name;
            this.lastName = createUserDto.lastName;
        }
    }
}