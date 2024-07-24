import { IsString, IsNotEmpty, IsEmail, IsAlpha, Length, IsLowercase, IsStrongPassword, IsAlphanumeric } from 'class-validator';

export class CreateUserDto {

    /**
     * Must be lowercase and can include numbers
     * @example jondoe77
     */
    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()//Contains only leters and numbers
    @Length(6,20)
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