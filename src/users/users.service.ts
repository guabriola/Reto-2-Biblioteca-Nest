import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) { }

    async findAll(params): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findUser(userId: number): Promise<User> {
        return await this.usersRepository.findOne({ where: { id: userId } })
    }

    async createUser(newUser: CreateUserDto): Promise<User> {
        return await this.usersRepository.save(newUser);
    }

    async updateUser(userId: number, newUser: UpdateUserDto): Promise<UpdateResult> {
        
        //This looks like the bes way to doit, using the Repository's update
        return this.usersRepository.update(userId, newUser);

        // This is an other way to doit - But it necessary to change the promisse to --> Promise<User>
        // let toUpdate = await this.usersRepository.findOne({ where: { id: userId } });
        // let userUpDated = Object.assign(toUpdate, newUser);
        // return this.usersRepository.save(userUpDated);
    }

    async deleteUser(userId: number): Promise<any> {
        return await this.usersRepository.delete(userId);
        // It can be done like this too
        // return await this.usersRepository.delete({ id: userId });
    }
}
