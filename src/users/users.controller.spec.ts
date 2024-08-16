import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UserDto } from './dto/user.dto';
import { Role } from 'src/roles/entities/role.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

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
    roles: [ roleAdmin, roleUser],
  };

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          //Moking user service
          provide: UsersService,
          useValue: {
            findUserByUsername: jest.fn(),
            findOneById: jest.fn(),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Find user by id', () => {

    //Find user by username
    it('should return user data when username is found', async () => {
      jest.spyOn(usersService, 'findUserById').mockResolvedValue(userDto);

      const result = await controller.findOneById(1);
      expect(result).toEqual(userDto);
    });

    //NotFoundException
    it('should throw NotFoundException when username is not found', async () => {
      jest.spyOn(usersService, 'findUserById').mockRejectedValue(new NotFoundException());

      await expect(controller.findOneById(1)).rejects.toThrow(NotFoundException);
    });
    
    //ForbiddenException
    it('should throw ForbiddenException if the user lacks the required role', async () => {
      jest.spyOn(usersService, 'findUserById').mockRejectedValue(new ForbiddenException());

      await expect(controller.findOneById(1)).rejects.toThrow(ForbiddenException);
    });

  })

  describe('Find user by username', () => {

    //Find user by username
    it('should return user data when username is found', async () => {
      jest.spyOn(usersService, 'findUserByUsername').mockResolvedValue(userDto);

      const result = await controller.findByUsername('admin');
      expect(result).toEqual(userDto);
    });

    //NotFoundException
    it('should throw NotFoundException when username is not found', async () => {
      jest.spyOn(usersService, 'findUserByUsername').mockRejectedValue(new NotFoundException());

      await expect(controller.findByUsername('nonexistentuser')).rejects.toThrow(NotFoundException);
    });
    
    //ForbiddenException
    it('should throw ForbiddenException if the user lacks the required role', async () => {
      jest.spyOn(usersService, 'findUserByUsername').mockRejectedValue(new ForbiddenException());

      await expect(controller.findByUsername('user')).rejects.toThrow(ForbiddenException);
    });

  })

});