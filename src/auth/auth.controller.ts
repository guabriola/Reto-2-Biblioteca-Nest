import { Body, Controller, Post, UseGuards, Request, Req } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor (private userService: UsersService, private authService: AuthService){}

    @Post("signup")
    signup(@Body() newUser: CreateUserDto) : Promise <UserDto>{
        return this.userService.createUser(newUser);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }
}
