import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService){}

    async signIn(username: string, pass: string): Promise<any>{
        const userDto = await this.usersService.findUserByUsername(username);
        const user = await this.usersService.findUser(userDto.id);
        if(user?.password !== pass){//* at the end the user?. it is explained.
            throw new UnauthorizedException();
        }
    }
}


// Optional Chaining (?.)
// Purpose
// The optional chaining operator provides a way to simplify accessing properties of an object that may or may not exist, preventing runtime errors that occur when you try to access a property of undefined or null.

// How it Works
// If the object before the ?. is null or undefined, the entire expression will short-circuit and return undefined.
// If the object exists, it will proceed to access the property specified after the ?..