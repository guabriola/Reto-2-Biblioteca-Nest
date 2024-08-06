import { Controller, Get, Param, Post, Req, Body, Delete, Put, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { Request } from 'express';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard, SelfOrAdminGuard } from 'src/auth/guards/roles.guard';
import { HasRoles } from 'src/common/decorators/has.roles.decorator';
import { Public } from 'src/common/decorators/public-auth.decorator';



@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(ThrottlerGuard, RolesGuard) //Applying Rate Limiting And RolesGuard
export class UsersController {
    constructor(private userService: UsersService) { }

    /**
    * Create new user
    */
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 403, description: 'Unauthorized' })
    @ApiResponse({ status: 409, description: 'Username or email already exists' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBearerAuth()
    @Public()
    @Post()
    create(@Body() newUser: CreateUserDto): Promise<UserDto> {
        return this.userService.createUser(newUser);
    }

    /**
    * Find all users
    */
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 403, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'There are no users in the Database' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBearerAuth()
    @HasRoles('ADMIN')
    @Get()
    findAll(@Req() request: Request): Promise<UserDto[]> {
        return this.userService.findAll(request.query);
    }

    /**
    * Find user by ID
    */
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 403, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'The resource you requested could not be found.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBearerAuth()
    @HasRoles('ADMIN')
    @Get(':userId')
    findOneById(@Param('userId') userId: number): Promise<UserDto> {
        return this.userService.findUserById(userId);
    }

    /**
    * Find user by username
    */
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 403, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden resource' })
    @ApiResponse({ status: 404, description: 'The resource you requested could not be found.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBearerAuth()
    @HasRoles('ADMIN')
    @Get('/byusername/:username')
    findByUsername(@Param('username') username: string): Promise<UserDto> {
        return this.userService.findUserByUsername(username);
    }

    /**
    *Update user,
    *User data can only be updated by the user themselves or by the ADMIN.
    *update one or more values at a time.
    *Username can't be changed
    */
    @ApiResponse({ status: 200, description: 'The user with id xxxx was updated' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 403, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN - Username can not be changed' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN - A user can only be updated by user it self or by ADMIN user.' })
    @ApiResponse({ status: 404, description: 'The resource you requested could not be found.' })
    @ApiResponse({ status: 409, description: 'Username or email already exists' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBearerAuth()
    @UseGuards(SelfOrAdminGuard)
    @Put(':userId')
    update(
        @Param('userId') userId: number,
        @Body() newUser: UpdateUserDto): Promise<any> {
        return this.userService.updateUser(userId, newUser);
    }

    /**
    * Delete User
    * ##Warning## - When user is deleted, user reservations will be deleted to!
    */
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 403, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'The resource you requested could not be found.' })
    @ApiResponse({ status: 409, description: 'User has saved reservations' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBearerAuth()
    @HasRoles('ADMIN')
    @Delete(':userId')
    delete(@Param('userId') userId: number): Promise<UserDto> {
        return this.userService.deleteUser(userId);
    }

    /**
     * Add Role
     * @example ADMIN, USER
     */
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 403, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'The resource you requested could not be found.' })
    @ApiResponse({ status: 409, description: 'User username already has the role rolename' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBearerAuth()
    @HasRoles('ADMIN')
    @Put('/:userName/:roleName')
    addRole(
        @Param('userName') userName: string,
        @Param('roleName') roleName: string
    ): Promise<UserDto> {
        return this.userService.addRole(userName, roleName);
    }

    /** 
    * Remove Role
    */
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 404, description: 'The resource you requested could not be found.' })
    @ApiResponse({ status: 404, description: 'NOT_FOUND - The user does not have that role' })
    @ApiResponse({ status: 403, description: 'Unauthorized' })
    @ApiResponse({ status: 409, description: 'NOT-ALLOWED - Users must have at least one role, add one before delete.' })
    @ApiBearerAuth()
    @HasRoles('ADMIN')
    @Delete('/:userName/:roleName')
    removeRole(
        @Param('userName') userName: string,
        @Param('roleName') roleName: string
    ): Promise<UserDto> {
        return this.userService.removeRole(userName, roleName);
    }
}
