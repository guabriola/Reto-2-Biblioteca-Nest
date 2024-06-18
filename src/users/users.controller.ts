import { Controller, Get, Param, Post, Req, Body, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor (private userService: UsersService){}

    @Post()
    create(@Body() newUser: User): Promise<User>{
        return this.userService.createUser(newUser);
    }

    @Get()
    findAll(@Req() request: Request): Promise<User[]>{
        return this.userService.findAll(request.query);
    }

    @Get(':userId')
    findOne(@Param('userId') userId: number): Promise<User>{
        return this.userService.findUser(userId);
    }

    @Put(':userId')
    update(
        @Param('userId') userId: number,
        @Body() newUser: User): Promise<User>
    {
        return this.userService.updateUser(userId, newUser);
    }

    @Delete(':userId')
    delete(@Param('userId') userId: number) : Promise<User>{
        return this.userService.deleteUser(userId);
    }
}
