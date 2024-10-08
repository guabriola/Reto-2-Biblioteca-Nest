import { IsString, IsNotEmpty, IsEmail, IsAlpha, Length, IsLowercase, IsStrongPassword, IsAlphanumeric, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';
import { Role } from 'src/roles/entities/role.entity';

export class CreateUserDto {

    /**
     * Must be lowercase and can include numbers
     * @example jondoe77
     */
    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()//Contains only leters and numbers
    @Length(6, 20)
    @IsLowercase()
    username: string;

    /**
     * @example jhondoe@email.com
     */
    @IsEmail()
    @IsNotEmpty()
    email: string;

    /**
    *minLength: 6,
    *minLowercase: 1,
    *minUppercase: 1,
    *minNumbers: 1,
    *minSymbols: 1,
    */
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string;

    /**
     *  Name of the user must be lowercase and only contain letters.
     *  @example jhon
     */
    @IsString()
    @IsAlpha()
    @Length(2)
    @IsNotEmpty()
    @IsLowercase()
    name: string;

    /**
     *  Last name of the user must be lowercase and only contain letters.
     *  @example doe
     */
    @IsString()
    @IsAlpha()
    @Length(2)
    @IsLowercase()
    @IsNotEmpty()
    lastName: string;

    /**
    * Roles of user 
    * @default USER for every new user
    * @requires ADMIN role to add another role.
    */
    @IsOptional()
    @IsArray()
    roles: Role[];

    constructor();

    constructor(createUserDto: CreateUserDto);

    constructor(createUserDto?: CreateUserDto) {
        if (createUserDto) {
            this.username = createUserDto.username;
            this.email = createUserDto.email;
            this.password = createUserDto.password;
            this.name = createUserDto.name;
            this.lastName = createUserDto.lastName;
            // this.roles = createUserDto.roles;
        }
    }
}