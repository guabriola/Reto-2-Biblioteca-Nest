import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UserDto } from './dto/user.dto';
import { Role } from 'src/roles/entities/role.entity';
import { ConflictException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  //Mock roles
  const roleAdmin: Role = {
    id: 1,
    role: 'ADMIN',
    users: []
  }
  const roleUser: Role = {
    id: 2,
    role: 'USER',
    users: []
  }

  //Mock userDto
  const userDto: UserDto = {
    id: 1,
    username: 'admin',
    email: 'admin@admin.com',
    name: 'ADMIN',
    lastName: 'ADMIN',
    roles: [roleAdmin, roleUser],
  };

  //Mock createUserDto
  const createUserDto: CreateUserDto = {

    "username": "admin",
    "email": "admin@mail.com",
    "password": "1234Aa!",
    "name": "admin",
    "lastName": "admin",
    'roles': []
  }

  //Mock createUserDto
  const updateUserDto: UpdateUserDto = {

    "username": "admin",
    "email": "admin@mail.com",
    "password": "1234Aa!",
    "name": "admin",
    "lastName": "admin"
  }

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          //Moking user service
          provide: UsersService,
          useValue: {
            findUserByUsername: jest.fn(),
            findUserById: jest.fn(),
            findAll: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            addRole: jest.fn(),
            removeRole: jest.fn(),
          },
        },
      ],
    })
      //Override ThrottleGuard.
      .overrideGuard(ThrottlerGuard)
      //Moking the response of the guard.
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  //Find user by id
  describe('Find user by id', () => {

    it('Should return user data when username is found', async () => {
      jest.spyOn(usersService, 'findUserById').mockResolvedValue(userDto);
      const result = await controller.findOneById(1);

      //Verify the expected result
      expect(result).toEqual(userDto);

      //Verify that findUserById it is called with 1 as argument
      expect(usersService.findUserById).toHaveBeenCalledWith(1);
    });

    //NotFoundException
    it('Should throw NotFoundException when username is not found', async () => {
      jest.spyOn(usersService, 'findUserById').mockRejectedValue(new NotFoundException());
      await expect(controller.findOneById(1)).rejects.toThrow(NotFoundException);

      //Verify that findUserById it is called with 1 as argument
      expect(usersService.findUserById).toHaveBeenCalledWith(1);
    });

    //ForbiddenException
    it('Should throw ForbiddenException if the user lacks the required role', async () => {
      jest.spyOn(usersService, 'findUserById').mockRejectedValue(new ForbiddenException());
      await expect(controller.findOneById(1)).rejects.toThrow(ForbiddenException);

      //Verify that findUserById it is called with 1 as argument
      expect(usersService.findUserById).toHaveBeenCalledWith(1);
    });

  })

  //Find user by username
  describe('Find user by username', () => {

    it('Should return user data when username is found', async () => {
      jest.spyOn(usersService, 'findUserByUsername').mockResolvedValue(userDto);
      const result = await controller.findByUsername('username');

      //Verify the expected result
      expect(result).toEqual(userDto);

      //Verify that findUserById it is called with 1 as argument
      expect(usersService.findUserByUsername).toHaveBeenCalledWith('username');
    });

    //NotFoundException
    it('Should throw NotFoundException when username is not found', async () => {
      jest.spyOn(usersService, 'findUserByUsername').mockRejectedValue(new NotFoundException());
      await expect(controller.findByUsername('username')).rejects.toThrow(NotFoundException);

      //Verify that findUserById it is called with 1 as argument
      expect(usersService.findUserByUsername).toHaveBeenCalledWith('username');
    });

    //Unauthorized
    it('Should throw Unauthorized if the user is not loged', async () => {
      jest.spyOn(usersService, 'findUserByUsername').mockRejectedValue(new UnauthorizedException());
      await expect(controller.findByUsername('username')).rejects.toThrow(UnauthorizedException);

      //Verify that findUserById it is called with 1 as argument
      expect(usersService.findUserByUsername).toHaveBeenCalledWith('username');
    });

    //ForbiddenException
    it('Should throw ForbiddenException if the user lacks the required role', async () => {
      jest.spyOn(usersService, 'findUserByUsername').mockRejectedValue(new ForbiddenException());
      await expect(controller.findByUsername('username')).rejects.toThrow(ForbiddenException);

      //Verify that findUserById it is called with 1 as argument
      expect(usersService.findUserByUsername).toHaveBeenCalledWith('username');
    });

  })

  //Find all users
  describe('Find all users', () => {

    it('Should find all users', async () => {
      jest.spyOn(usersService, 'findAll').mockResolvedValue([userDto]);
      const result = await controller.findAll();
      expect(result).toEqual([userDto])
      expect(usersService.findAll).toHaveBeenCalledWith();
    })

    //NotFoundException
    it('Should throw NotFoundException when there are no users', async () => {
      jest.spyOn(usersService, 'findAll').mockRejectedValue(new NotFoundException());
      await expect(controller.findAll()).rejects.toThrow(NotFoundException);
      expect(usersService.findAll).toHaveBeenCalledWith();
    });

    //Unauthorized
    it('Should throw Unauthorized if the user is not loged', async () => {
      jest.spyOn(usersService, 'findAll').mockRejectedValue(new UnauthorizedException());
      await expect(controller.findAll()).rejects.toThrow(UnauthorizedException);
      expect(usersService.findAll).toHaveBeenCalledWith();
    });

    //ForbiddenException
    it('Should throw ForbiddenException if the user lacks the required role', async () => {
      jest.spyOn(usersService, 'findAll').mockRejectedValue(new ForbiddenException());
      await expect(controller.findAll()).rejects.toThrow(ForbiddenException);
      expect(usersService.findAll).toHaveBeenCalledWith();
    });

  });

  //Create a new user
  describe('Create new user', () => {

    it('Should create a new user', async () => {
      jest.spyOn(usersService, 'createUser').mockResolvedValue(userDto);
      const result = await controller.create(createUserDto);
      expect(result).toEqual(userDto);
      expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
    });

    //Username or email already exists
    it('Should throw ConflictException if user or email already exists', async () => {
      jest.spyOn(usersService, 'createUser').mockRejectedValue(
        new ConflictException('Username or email already exists')
      );
      await expect(controller.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  //Update a user
  describe('Update a user', () => {

    it('Shoud return message - The user with id x was updated',
      async () => {
        const userId = 7;
        const message = `The user with id ${userId} was updated`;

        jest.spyOn(usersService, 'updateUser').mockResolvedValue(message);
        const result = await controller.update(7, updateUserDto);
        expect(result).toEqual('The user with id 7 was updated')
        expect(usersService.updateUser).toHaveBeenCalledWith(userId, updateUserDto);
      }
    )

    //Unauthorized
    it('Should throw Unauthorized if the user is not loged', async () => {
      const userId = 7;

      jest.spyOn(usersService, 'updateUser').mockRejectedValue(new UnauthorizedException());
      await expect(controller.update(7, updateUserDto)).rejects.toThrow(UnauthorizedException);
      expect(usersService.updateUser).toHaveBeenCalledWith(userId, updateUserDto);
    });

    //ForbiddenException
    it('Should throw ForbiddenException if is not the user or admin user', async () => {
      const userId = 7;

      jest.spyOn(usersService, 'updateUser').mockRejectedValue(new ForbiddenException());
      await expect(controller.update(7, updateUserDto)).rejects.toThrow(ForbiddenException);
      expect(usersService.updateUser).toHaveBeenCalledWith(userId, updateUserDto);
    });

    //Email already exists
    it('Should throw ConflictException if user or email already exists', async () => {
      const userId = 7;

      jest.spyOn(usersService, 'updateUser').mockRejectedValue(
        new ConflictException('Email already exists')
      );
      await expect(controller.update(7, updateUserDto)).rejects.toThrow(ConflictException);
      expect(usersService.updateUser).toHaveBeenCalledWith(userId, updateUserDto);
    })
  })

  //Delete user
  describe('Delete a user', () => {

    it('Shoud return message - The user with id x was deleted',
      async () => {
        const userId = 7;
        const message = `The user with id ${userId} was deleted`;

        jest.spyOn(usersService, 'deleteUser').mockResolvedValue(message)
        const result = await controller.delete(userId);
        expect(result).toEqual(message);
        expect(usersService.deleteUser).toHaveBeenCalledWith(userId);
      }
    )

    //Unauthorized
    it('Should throw Unauthorized if the user is not loged', async () => {
      const userId = 7;

      jest.spyOn(usersService, 'deleteUser').mockRejectedValue(new UnauthorizedException());
      await expect(controller.delete(userId)).rejects.toThrow(UnauthorizedException);
      expect(usersService.deleteUser).toHaveBeenCalledWith(userId);
    });

    //ForbiddenException
    it('Should throw ForbiddenException if is not the user or admin user', async () => {
      const userId = 7;

      jest.spyOn(usersService, 'deleteUser').mockRejectedValue(new ForbiddenException());
      await expect(controller.delete(userId)).rejects.toThrow(ForbiddenException);
      expect(usersService.deleteUser).toHaveBeenCalledWith(userId);
    });

  })

  //Add role
  describe('Add new role to an user', () => {

    it('Should add a role to an user', async () => {
      jest.spyOn(usersService, 'addRole').mockResolvedValue(userDto);
      const result = await controller.addRole('username', 'role');
      expect(result).toEqual(userDto);
      expect(usersService.addRole).toHaveBeenCalledWith('username', 'role');
    });

    //User already hast that role
    it('Should throw ConflictException if user already has the role', async () => {
      jest.spyOn(usersService, 'addRole').mockRejectedValue(
        new ConflictException('User username already has the role rolename')
      );
      await expect(controller.addRole('username', 'role')).rejects.toThrow(ConflictException);
      expect(usersService.addRole).toHaveBeenCalledWith('username', 'role');
    })

    //Unauthorized
    it('Should throw Unauthorized if the user is not loged', async () => {
      jest.spyOn(usersService, 'addRole').mockRejectedValue(new UnauthorizedException());
      await expect(controller.addRole('username', 'role')).rejects.toThrow(UnauthorizedException);
      expect(usersService.addRole).toHaveBeenCalledWith('username', 'role');
    });

    //ForbiddenException
    it('Should throw ForbiddenException if is not the user or admin user', async () => {
      jest.spyOn(usersService, 'addRole').mockRejectedValue(new ForbiddenException());
      await expect(controller.addRole('username', 'role')).rejects.toThrow(ForbiddenException);
      expect(usersService.addRole).toHaveBeenCalledWith('username', 'role');
    });
  })

  //Remove role
  describe('Remove a role from user', () => {
    it('Should remove a role from user', async () => {
      jest.spyOn(usersService, 'removeRole').mockResolvedValue(userDto);
      const result = await controller.removeRole('username', 'role');
      expect(result).toEqual(userDto);
      expect(usersService.removeRole).toHaveBeenCalledWith('username', 'role');
    })

    //User does not have that role
    it('Should throw NotFoundException - The user does not have that role', async () => {
      jest.spyOn(usersService, 'removeRole').mockRejectedValue(new NotFoundException('The user does not have that role'));
      await expect(controller.removeRole('username', 'role')).rejects.toThrow(NotFoundException);
      expect(usersService.removeRole).toHaveBeenCalledWith('username', 'role');
    })

    //Unauthorized
    it('Should throw Unauthorized if the user is not loged', async () => {
      jest.spyOn(usersService, 'removeRole').mockRejectedValue(new UnauthorizedException());
      await expect(controller.removeRole('username', 'role')).rejects.toThrow(UnauthorizedException);
      expect(usersService.removeRole).toHaveBeenCalledWith('username', 'role');
    });

    //ForbiddenException
    it('Should throw ForbiddenException if is not the user or admin user', async () => {
      jest.spyOn(usersService, 'removeRole').mockRejectedValue(new ForbiddenException());
      await expect(controller.removeRole('username', 'role')).rejects.toThrow(ForbiddenException);
      expect(usersService.removeRole).toHaveBeenCalledWith('username', 'role');
    });
  })
});