import { Controller, Get, Param, Post, Req, Body, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
    constructor (private userService: UsersService){}

    //Create user
    @Post()
    create(@Body() newUser: User): Promise<UserDto>{
        return this.userService.createUser(newUser);
    }

    //Find all users
    @Get()
    findAll(@Req() request: Request): Promise<UserDto[]>{
        return this.userService.findAll(request.query);
    }

    //Find user by id
    @Get(':userId')
    findOne(@Param('userId') userId: number): Promise<UserDto>{
        return this.userService.findUser(userId);
    }

    //Find user by username
    @Get('/byusername/:username')
    findByUsername(@Param('username') username: string): Promise<UserDto>{
        return this.userService.findUserByUsername(username);
    }

    //Update user
    @Put(':userId')
    update(
        @Param('userId') userId: number,
        @Body() newUser: User): Promise<any> //The "UpdateReult" is because i'm using the Repository's update method.
    {
        return this.userService.updateUser(userId, newUser);
    }

    //Delete User
    @Delete(':userId')
    delete(@Param('userId') userId: number) : Promise<UserDto>{
        return this.userService.deleteUser(userId);
    }
}
