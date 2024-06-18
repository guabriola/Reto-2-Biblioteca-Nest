import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ){}

    async findAll(params): Promise<User[]>{
        return await this.usersRepository.find();
    }

    async findUser(userId: number): Promise<User>{
        return await this.usersRepository.findOne({ where: {id:userId}})
    }

    async createUser(newUser: User): Promise <User>{
        return await this.usersRepository.save(newUser);
    }

    async updateUser(userId: number, newUser: User): Promise<User>{
        let toUpdate = await this.usersRepository.findOne({where: {id: userId}});
        let userUpDated = Object.assign(toUpdate, newUser);

        return this.usersRepository.save(userUpDated);
    }

    async deleteUser(userId: number): Promise<any>{
        return await this.usersRepository.delete({id: userId});
    }
}
