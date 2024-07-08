import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
    constructor (private userService: UsersService){}

    @Post("signup")
    signup(@Body() newUser: CreateUserDto) : Promise <UserDto>{
        return this.userService.createUser(newUser);
    }
    
}
