import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}
        
    async signIn(username: string, pass: string): Promise<any>{
        const userDto = await this.usersService.findUserByUsername(username);
        const user = await this.usersService.findUser(userDto.id);
        if(user?.password !== pass){//* at the end of the file the user?. it is explained.
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
    const payload = { username: user.username,
         sub: user.id,
         //I choose a property name of sub to hold our userId value to be consistent with JWT standards.
         role: user.role,
        };
    return {
        access_token: this.jwtService.sign(payload),
    };
    }
}


// Optional Chaining (?.)
// Purpose
// The optional chaining operator provides a way to simplify accessing properties of an object that may or may not exist, preventing runtime errors that occur when you try to access a property of undefined or null.

// How it Works
// If the object before the ?. is null or undefined, the entire expression will short-circuit and return undefined.
// If the object exists, it will proceed to access the property specified after the ?..