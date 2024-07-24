import { Controller, Get, Param, Post, Req, Body, Delete, Put, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ApiBearerAuth,  ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(ThrottlerGuard) //Applying Rate Limiting
export class UsersController {
    constructor (private userService: UsersService){}

    /**
    * Create new user
    */
    @ApiResponse({ status: 400, description: 'ERROR - Something has happend'})
    @ApiResponse({ status: 400, description: 'email must be an email'})
    @ApiResponse({ status: 403, description: 'Unauthorized'})
    @ApiResponse({ status: 409, description: 'Username or email already exists'})
    @ApiResponse({ status: 500, description: 'Internal Server Error'})
    @Post()
    create(@Body() newUser: CreateUserDto): Promise<UserDto>{
        return this.userService.createUser(newUser);
    }

    /**
    * Find all users
    */
    @ApiResponse({ status: 403, description: 'Unauthorized'})
    @ApiResponse({ status: 500, description: 'Internal Server Error'})
    @Get()
    findAll(@Req() request: Request): Promise<UserDto[]>{
        return this.userService.findAll(request.query);
    }

    /**
    * Find user by ID
    */
    @ApiResponse({ status: 403, description: 'Unauthorized'})
    @ApiResponse({ status: 500, description: 'Internal Server Error'})
    @Get(':userId')
    findOne(@Param('userId') userId: number): Promise<User>{
        return this.userService.findUser(userId);
    }

    /**
    * Find user by username
    */
    @ApiResponse({ status: 403, description: 'Unauthorized'})
    @ApiResponse({ status: 500, description: 'Internal Server Error'})
    @Get('/byusername/:username')
    findByUsername(@Param('username') username: string): Promise<UserDto>{
        return this.userService.findUserByUsername(username);
    }

    /**
    *Update user,
    *update one or more values at time.
    */
    @ApiResponse({ status: 409, description: 'Username or email already exists'})
    @ApiResponse({ status: 404, description: 'NOT_FOUND - User not found'})
    @ApiResponse({ status: 403, description: 'Unauthorized'})
    @ApiResponse({ status: 400, description: 'ERROR - Something has happend'})
    @ApiResponse({ status: 400, description: 'email must be an email'})
    @ApiResponse({ status: 500, description: 'Internal Server Error'})
    @ApiResponse({ status: 200, description: 'The user with id xxxx was updated'})
    @Put(':userId')
    update(
        @Param('userId') userId: number,
        @Body() newUser: UpdateUserDto): Promise<any>
    {
        return this.userService.updateUser(userId, newUser);
    }

    /**
    * Delete User
    */
    @ApiResponse({ status: 403, description: 'Unauthorized'})
    @ApiResponse({ status: 500, description: 'Internal Server Error'})
    @Delete(':userId')
    delete(@Param('userId') userId: number) : Promise<UserDto>{
        return this.userService.deleteUser(userId);
    }
}
