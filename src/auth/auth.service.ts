import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(username: string, pass: string): Promise<any> {
        const userDto = await this.usersService.findUserByUsername(username);
        const user = await this.usersService.findUser(userDto.id);
        if (user?.password !== pass) {//* at the end of the file the user?. it is explained.
            throw new UnauthorizedException();
        }
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const userDto = await this.usersService.findUserByUsername(username);
        const user = await this.usersService.findUser(userDto.id);
        //Unhasing the password of the DB and compared to the entroduced password
        const unHashedPass = await bcrypt.compare(pass, user.password)

        if (user && unHashedPass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        //Making sure thar roles are loaded
        const userWithRoles = await this.usersService.findUserByUsername(user.username);
        const payload = {
            username: userWithRoles.username,
            sub: userWithRoles.id,
            roles: userWithRoles.roles.map(role => role.role),
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}