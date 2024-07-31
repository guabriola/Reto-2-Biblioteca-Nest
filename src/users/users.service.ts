import { Injectable, HttpStatus, HttpException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import * as bcrypt from "bcrypt";
import { RolesService } from 'src/roles/roles.service';

require('dotenv').config();

@Injectable()
export class UsersService {

    constructor(
        private roleService: RolesService,
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
                throw new NotFoundException(`There is no username with id ${userId}`);

        } catch (e) {
            throw e;
        }

    }

    //Find a user by Id for the controller  - Returns UserDto For authentication
    async findUserById(userId: number): Promise<UserDto> {

        try {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            if (user) {
                return new UserDto(user);
            } else
                throw new NotFoundException(`There is no username with id ${userId}`);

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
                throw new NotFoundException(`User ${username.toLowerCase()} is not exist.`);
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
                return new HttpException({
                    error: `NOT_FOUND - User not found`
                }, HttpStatus.NOT_FOUND);
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
                throw new NotFoundException('NOT_FOUND - User not exists');
            }

            //Role exists?
            if (!roleToAdd) {
                throw new NotFoundException('NOT_FOUND - Role not exists');
            }
            
            //User already have the role?
            if (user.roles.some(role => role.id === roleToAdd.id)) {
                throw new HttpException(`User ${username} already has the role ${roleName}`, HttpStatus.CONFLICT);
            }

            user.roles.push(roleToAdd);
            const updatedUser = await this.usersRepository.save(user);
            return new UserDto(updatedUser);
        } catch (e) {
            throw e;
        }
    }

    //Delete a user
    async deleteUser(userId: number): Promise<any> {

        try {
            const response = await this.usersRepository.delete(userId);
            // It can be done like this too --> await this.usersRepository.delete({ id: userId });

            if (response.affected != 1) {
                return new HttpException({
                    error: `NOT_FOUND - There is not book with id ${userId}`
                }, HttpStatus.NOT_FOUND)
            }

            if (response.affected == 1) {
                return `The book with id ${userId} was deleted`;
            }
        } catch (e) {
            throw e;
        }

    }
}
