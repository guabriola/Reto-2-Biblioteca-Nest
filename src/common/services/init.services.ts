import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { error } from "console";
import { CreateUserDto } from "src/users/dto/createUser.dto";
import { Role } from "src/roles/entities/role.entity";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { RolesService } from "src/roles/roles.service";
import { CreateRoleDto } from "src/roles/dto/create-role.dto";


@Injectable()
export class InitService implements OnModuleInit {
    constructor(
        private userService: UsersService,
        private roleService: RolesService,
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Role) private rolesRepository: Repository<Role>,
    ) { }


    async onModuleInit() {
        await this.createUserRoles();
        await this.createUserAdm();
    }

    private async createUserRoles() {

        try {
            // const adminRole = await this.rolesRepository.findOne({ where: { role: 'ADMIN' } });
            // const userRole = await this.rolesRepository.findOne({ where: { role: 'USER' } });

            const [adminRole, userRole] = await Promise.all([
                this.rolesRepository.findOne({ where: { role: 'ADMIN' } }),
                this.rolesRepository.findOne({ where: { role: 'USER' } })
            ]);

            if (!adminRole) {
                console.log('Initializing USER ADMIN roles configuration...');
                console.log('Creating ADMIN role...');
                const newRoleAdmin = new CreateRoleDto({ role: 'ADMIN' });
                await this.rolesRepository.save(newRoleAdmin);
                console.log('ADMIN role created!')
            }

            if (!userRole) {
                console.log('Creating USER role...');
                const newRoleUser = new CreateRoleDto({ role: 'USER' });
                await this.rolesRepository.save(newRoleUser);
                console.log('USER role created!')
            }

        } catch (error) {
            console.error('Error creating roles', error);
        }
    }

    private async createUserAdm() {
        try {
            
            const adminRole = await this.rolesRepository.findOne({ where: { role: 'ADMIN' } });
            const admin = await this.usersRepository.findOne({ where: { username: 'admin' } });

            if (!admin && adminRole) {
                console.log('Admin user creatrion in progress...');
                const newAdminUser = new CreateUserDto({
                    "username": "admin",
                    "email": process.env.ADMIN_EMAIL,
                    "password": process.env.ADMIN_PASSWORD,
                    "name": process.env.ADMIN_NAME,
                    "lastName": process.env.ADMIN_LAST_NAME,
                    "roles": []
                });
                newAdminUser.roles = [adminRole];
                this.userService.createUser(newAdminUser);
                //To Do
                //Change console.log for logging
                console.log("The user admin was created as a ADMIN");

            }
        } catch (e) {
            console.error('Error creating admin user', e);
        }
    }

}