import { Injectable, HttpStatus, HttpException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {

    //User service is basic but functional, it will be improve when Security with JWT is implemented

    constructor(
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

    //Find a user
    async findUser(userId: number): Promise<UserDto> {

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
    

    //Create a user
    async createUser(newUser: CreateUserDto): Promise<UserDto> {
        try {
            const createdUser = await this.usersRepository.save(newUser);
            return new UserDto(createdUser);
        } catch (e) {
            if (e instanceof QueryFailedError) {
                if (e.driverError.errno = 1062 || e.driverError.code.includes('ER_DUP_ENTRY')) {
                    console.log(e)
                    throw new HttpException('Username or email already exists', HttpStatus.CONFLICT);
                }
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Update a user
    async updateUser(userId: number, newUser: UpdateUserDto): Promise<any> {

        try {
            //This looks like is the best way update, using the Repository's update
            //At the end of the service is another way to doit.
            const response = await this.usersRepository.update(userId, newUser);
            if (response.affected != 1) {
                return new HttpException({
                    error: `NOT_FOUND - There is not book with id ${userId}`
                }, HttpStatus.NOT_FOUND)
            }

            if (response.affected == 1) {
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

        // This is an other way to doit - But it necessary to change the promisse to --> Promise<User>
        // let toUpdate = await this.usersRepository.findOne({ where: { id: userId } });
        // let userUpDated = Object.assign(toUpdate, newUser);
        // return this.usersRepository.save(userUpDated);
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
