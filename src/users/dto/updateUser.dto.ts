import { IsString, IsEmail, IsOptional, IsNotEmpty, IsAlphanumeric, Length, IsLowercase, IsStrongPassword, IsAlpha, IsArray } from 'class-validator';
import { Role } from 'src/roles/entities/role.entity';


export class UpdateUserDto {

    /**
     * VALUE IS OPTIONAL /
     * Must be lowercase and can include numbers
     * @example jondoe77
    */
    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()//Contains only leters and numbers
    @Length(6, 20)
    @IsLowercase()
    @IsOptional()
    username: string;

    /**
     * VALUE IS OPTIONAL / Must be email format.
     * @example jhondoe@email.com
     */
    @IsEmail()
    @IsOptional()
    email: string;


    /**
    * VALUE IS OPTIONAL /
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
    @IsOptional()
    password: string;


    /**
     * VALUE IS OPTIONAL /
     *  Name of the user must be lowercase and only contain letters.
     *  @example jhon
     */
    @IsString()
    @IsAlpha()
    @Length(2)
    @IsOptional()
    name: string;

    /**
     * VALUE IS OPTIONAL /
     *  Last name of the user must be lowercase and only contain letters.
     *  @example doe
     */
    @IsString()
    @IsAlpha()
    @Length(2)
    @IsOptional()
    lastName: string;

    /**
    * VALUE IS OPTIONAL 
    * Roles of user 
    * @example ADMIN, USER
    */
    @IsOptional()
    @IsArray()
    roles: Role[];

}