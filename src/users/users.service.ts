import { Injectable, HttpStatus, HttpException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import * as bcrypt from "bcrypt";
import { RolesService } from 'src/roles/roles.service';
import NotFoundError from 'src/common/errors/not-found.exception';
import { ReservationsService } from 'src/reservations/reservations.service';

require('dotenv').config();

@Injectable()
export class UsersService {

    constructor(
        private roleService: RolesService,
        private reservationsService: ReservationsService,
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) { }

    //Find all users
    async findAll(params): Promise<UserDto[]> {
        try {
            const users = await this.usersRepository.find();
            if (users.length > 0) {
                return users.map(user => (new UserDto(user)));
            } else throw new NotFoundException(`There are no users in the Database`);

        } catch (e) {
            throw e;
        }
    }

    //Find a user - Returns the complete user. For authentication
    async findUser(userId: number): Promise<User> {

        try {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            if (user) {
                return user;
            } else
                throw new NotFoundError('User', userId.toString())
        } catch (e) {
            throw e;
        }

    }

    //Find a user by Id for the controller  - Returns UserDto
    async findUserById(userId: number): Promise<UserDto> {

        try {
            const user = await this.usersRepository.findOne({
                where: {
                    id: userId
                },
                relations: ['roles']
            });
            if (user) {
                return new UserDto(user);
            } else
                throw new NotFoundError('User', userId.toString());
        } catch (e) {
            throw e;
        }

    }



    //Find a user by username
    async findUserByUsername(username: string): Promise<UserDto> {

        try {
            const findedUser = await this.usersRepository.find({
                where: {
                    username: username,
                },
                relations: ['roles']
            })

            if (findedUser.length > 0) {
                return new UserDto(findedUser[0]);
            } else {
                throw new NotFoundError('User', username);
            }

        } catch (error) {
            throw error;
        }

    }


    //Create a user
    async createUser(newUser: CreateUserDto): Promise<UserDto> {
        try {

            //Encriptation and serch of the default roll (USER)
            const salt = await bcrypt.genSalt();
            const userRole = await this.roleService.findOneByRoleName('USER');
            //Password encriptation
            newUser.password = await bcrypt.hash(newUser.password, salt);
            //Add role
            newUser.roles = [userRole];

            const createdUser = await this.usersRepository.save(newUser);
            return new UserDto(createdUser);
        } catch (e) {
            if (e instanceof QueryFailedError) {
                if (e.driverError.errno = 1062 || e.driverError.code.includes('ER_DUP_ENTRY')) {
                    throw new HttpException('Username or email already exists', HttpStatus.CONFLICT);
                }
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Update a user
    async updateUser(userId: number, newUser: UpdateUserDto): Promise<any> {

        try {

            const userToUpdate = await this.usersRepository.findOneBy({ id: userId });

            if (!userToUpdate) {
                return new NotFoundError('User', userId.toString());
            } else {

                if (newUser.username) {
                    return new HttpException({
                        error: `FORBIDDEN - Username can not be changed`
                    }, HttpStatus.FORBIDDEN)
                }

                if (newUser.password) {
                    const salt = await bcrypt.genSalt();
                    newUser.password = await bcrypt.hash(newUser.password, salt);
                }

                const response = await this.usersRepository.update(userId, newUser);

                if (response.affected != 1) {
                    return new HttpException({
                        error: `ERROR - Something has happend`
                    }, HttpStatus.BAD_REQUEST)
                }

                return `The user with id ${userId} was updated`
            }

        } catch (e) {
            if (e instanceof QueryFailedError) {
                if (e.driverError.errno = 1062 || e.driverError.code.includes('ER_DUP_ENTRY')) {
                    throw new HttpException('Username or email already exists', HttpStatus.CONFLICT);
                }
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // This is an other way to the update line - But it necessary to change the promisse to --> Promise<User>
        // let toUpdate = await this.usersRepository.findOne({ where: { id: userId } });
        // let userUpDated = Object.assign(toUpdate, newUser);
        // return this.usersRepository.save(userUpDated);
    }

    //Add Role
    async addRole(username: string, roleName: string): Promise<UserDto> {

        try {
            const user = await this.findUserByUsername(username);
            const roleToAdd = await this.roleService.findOneByRoleName(roleName);

            //User exists?
            if (!user) {
                throw new NotFoundError('User', username);
            }

            //Role exists?
            if (!roleToAdd) {
                throw new NotFoundError('Role', roleName);
            }

            //Does the user have that role?
            if (user.roles.some(role => role.id === roleToAdd.id)) {
                throw new HttpException(`User ${username} already has the role ${roleName}`, HttpStatus.CONFLICT);
            }

            //Adding the role
            user.roles.push(roleToAdd);
            const updatedUser = await this.usersRepository.save(user);
            return new UserDto(updatedUser);
        } catch (e) {
            throw e;
        }
    }

    //Remove Role
    async removeRole(username: string, roleName: string): Promise<UserDto> {
        try {
            const user = await this.findUserByUsername(username);
            const roleToDelete = await this.roleService.findOneByRoleName(roleName);

            if (user.roles.length > 1) {
                //User exists?
                if (!user) {
                    throw new NotFoundError('User', username);
                }

                //Role exists?
                if (!roleToDelete) {
                    throw new NotFoundError('Role', roleName);
                }

                //Does the user have that role?
                if (!user.roles.some(role => role.id === roleToDelete.id)) {
                    throw new NotFoundException('NOT_FOUND - The user does not have that role');
                }

                //Removing the role
                if (user.roles.some(role => role.id === roleToDelete.id)) {
                    const roleIndex = user.roles.indexOf(user.roles.find(role => role.id === roleToDelete.id))
                    user.roles.splice(roleIndex, 1);
                    const updatedUser = await this.usersRepository.save(user);
                    return new UserDto(updatedUser);
                }
            } else {
                throw new HttpException('NOT-ALLOWED - Users must have at least one role, add one before delete.', HttpStatus.CONFLICT)
            }
        } catch (e) {
            throw e;
        }

    }

    //Delete a user
    async deleteUser(userId: number): Promise<any> {

        try {
            const userToDelete = await this.findUserById(userId);

            if (userToDelete) {
                if ((await this.reservationsService.findReservationByUserId(userId.toString())).length > 0) {
                    throw new HttpException({
                        error: `ERROR - User has saved reservations`
                    }, HttpStatus.CONFLICT)
                }
                const response = await this.usersRepository.delete(userId);
                // It can be done like this too --> await this.usersRepository.delete({ id: userId });

                if (response.affected != 1) {
                    throw new BadRequestException('Server error Try later');
                }

                if (response.affected == 1) {
                    return `The user with id ${userId} was deleted`;
                }
            } else throw new NotFoundError('User id', userId.toString());

        } catch (e) {
            throw e;
        }

    }
}
