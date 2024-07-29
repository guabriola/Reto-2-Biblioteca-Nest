import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { error } from "console";
import { todo } from "node:test";
import { CreateUserDto } from "src/users/dto/createUser.dto";
import { Role } from "src/users/entities/role.enum";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";


@Injectable()
export class InitService implements OnModuleInit {
    constructor(
        private userService: UsersService,
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) { }


    async onModuleInit() {
        await this.createUserAdm();
    }

    private async createUserAdm() {
        try {
            // const admin = await this.userService.findUserByUsername("admin");
            const admin = await this.usersRepository.findOne({ where: { username: 'admin' } });

            if (!admin) {
                const newAdminUser = new CreateUserDto({
                    "username": "admin",
                    "email": process.env.ADMIN_EMAIL,
                    "password": process.env.ADMIN_PASSWORD,
                    "name": process.env.ADMIN_NAME,
                    "lastName": process.env.ADMIN_LAST_NAME, 
                    "role": Role.Admin
                });
                this.userService.createUser(newAdminUser)
                //To Do
                //Change console.log for logging
                console.log("The user admin was created")
            }
        } catch (e) {
            throw new error('Error creating admin user', error);
        }
    }
}