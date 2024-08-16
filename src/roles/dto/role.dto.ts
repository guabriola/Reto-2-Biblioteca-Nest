import { IsAlpha, IsNotEmpty, IsNumber, IsString, IsUppercase } from "class-validator";


export class RoleDto {
        /**
     * Role must be unique
     * @example ADMIN, USER
     */
        @IsNumber()
        id: number;

        @IsAlpha()
        @IsString()
        @IsNotEmpty()
        @IsUppercase()
        role: String;
}
