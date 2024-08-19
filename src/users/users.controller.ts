import { Controller, Get, Param, Post, Req, Body, Delete, Put, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
    @ApiOperation({
        summary: 'Create New User - ADMIN Access',
      })
    @ApiResponse({ status: 400, description: 'Bad Request' })
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
    @ApiOperation({
        summary: 'Find all users - ADMIN Access',
      })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden resource' })
    @ApiResponse({ status: 404, description: 'There are no users in the Database' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBearerAuth()
    @HasRoles('ADMIN')
    @Get()
    findAll(): Promise<UserDto[]> {
        return this.userService.findAll();
    }

    /**
    * Find user by ID
    */
    @ApiOperation({
        summary: 'Find user by ID - ADMIN Access',
      })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden resource' })
    @ApiResponse({ status: 404, description: 'The resource you requested could not be found.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBearerAuth()
    @HasRoles('ADMIN')
    @Get(':userId')
    findOneById(@Param('userId', ParseIntPipe) userId: number): Promise<UserDto> {
        return this.userService.findUserById(userId);
    }

    /**
    * Find user by username
    */
    @ApiOperation({
        summary: 'Find user by username - ADMIN Access',
      })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 400, description: 'Validation failed (numeric string is expected)' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
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
    */
    @ApiOperation({
        summary: 'Update user - Admin or user itself access.',
        description: `
        Rules:
        1 - User data can only be updated by the user themselves or by the ADMIN.\n
        2 - Can update one or more values at a time.\n
        3 - Username can't be changed
        `,
      })
    @ApiResponse({ status: 200, description: 'The user with id xxxx was updated' })
    @ApiResponse({ status: 400, description: 'Validation failed (numeric string is expected)' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden resource' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN - Username can not be changed' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN - Only user it self or ADMIN are authorized.' })
    @ApiResponse({ status: 404, description: 'The resource you requested could not be found.' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBearerAuth()
    @UseGuards(SelfOrAdminGuard)
    @Put(':userId')
    update(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() newUser: UpdateUserDto): Promise<any> {
        return this.userService.updateUser(userId, newUser);
    }

    /**
    * Delete User
    */
    @ApiOperation({
        summary: 'Delete User - ADMIN Access',
        description: `
        ##Warning##
        When user is deleted, user reservations will be deleted to!`,
      })
    @ApiResponse({ status: 200, description: 'The user with id xxxx was updated' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 400, description: 'Validation failed (numeric string is expected)' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden resource' })
    @ApiResponse({ status: 404, description: 'The resource you requested could not be found.' })
    @ApiResponse({ status: 409, description: 'User has saved reservations' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBearerAuth()
    @HasRoles('ADMIN')
    @Delete(':userId')
    delete(@Param('userId', ParseIntPipe) userId: number): Promise<UserDto> {
        return this.userService.deleteUser(userId);
    }

    /**
     * Add Role
     */
    @ApiOperation({
        summary: 'Add Role - ADMIN Access',
        description: `ADMIN or USER`,
      })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden resource' })
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
    @ApiOperation({
        summary: 'Remove Role - ADMIN Access',
        description: `User must have at least one role.`,
      })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 403, description: 'Forbidden resource' })
    @ApiResponse({ status: 404, description: 'The resource you requested could not be found.' })
    @ApiResponse({ status: 404, description: 'NOT_FOUND - The user does not have that role' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
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
