import { IsAlpha, IsNotEmpty, IsString, IsUppercase } from "class-validator";


export class CreateRoleDto {
        /**
     * Role must be unique
     * @example ADMIN, USER
     */
        @IsAlpha()
        @IsString()
        @IsNotEmpty()
        @IsUppercase()
        role: String;

    constructor();

    constructor(createRoleDto: CreateRoleDto);
    
    constructor(createRoleDto?: CreateRoleDto){
        if(createRoleDto){
            this.role = createRoleDto.role;
        }
    }
}
