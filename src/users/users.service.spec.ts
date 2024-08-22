import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RolesService } from 'src/roles/roles.service';
import { ReservationsService } from 'src/reservations/reservations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserDto } from './dto/user.dto';
import { ConflictException, ForbiddenException, HttpException, NotFoundException } from '@nestjs/common';
import NotFoundError from 'src/common/errors/not-found.exception';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from './dto/updateUser.dto';
import { use } from 'passport';

describe('UsersService', () => {

  let service: UsersService;
  let userRepository: jest.Mocked<Repository<User>>;
  let rolesService: jest.Mocked<RolesService>;

  const mockUser: User = {
    id: 1,
    username: 'user',
    email: 'user@example.com',
    password: 'password',
    name: 'new',
    lastName: 'user',
    roles: [],
    bookReservations: [],
  }

  const mockUserDto: UserDto = {
    id: 1,
    username: 'user',
    email: 'user@example.com',
    name: 'new',
    lastName: 'user',
    roles: [],
  }

  const mockRole = { id: 1, role: 'USER' };

  const mockCreateUserDto: CreateUserDto = {
    username: 'user',
    email: 'user@example.com',
    password: 'password',
    name: 'new',
    lastName: 'user',
    roles: [],
  }

  const mockUpdateUserDto = new UpdateUserDto();
  mockUpdateUserDto.name = 'NewName';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          }
        },
        {
          provide: ReservationsService,
          useValue: {},
        },
        {
          provide: RolesService,
          useValue: {
            findOneByRoleName: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    rolesService = module.get(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //Find all
  describe('Find all users', () => {

    it('should return an array of users', async () => {
      userRepository.find.mockResolvedValue([mockUser]);
      const result = await service.findAll();

      expect(result).toEqual([mockUser].map(user => new UserDto(user)));
      expect(userRepository.find).toHaveBeenCalledWith();
    });

    it('should throw a NotFoundException if no users are found', async () => {
      userRepository.find.mockResolvedValue([]);

      expect(service.findAll()).rejects.toThrow(NotFoundException);
      expect(userRepository.find).toHaveBeenCalledWith();
    });
  });

  //Find a user - for Authentication 
  describe('Find a user for authentication', () => {

    it('Should return the user of the provided id', async () => {
      const userId = 1;
      userRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findUser(userId);

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });

    it('Should throw a NotFoundError if user is not found', async () => {
      const userId = 1;
      userRepository.findOne.mockResolvedValue(null);

      expect(service.findUser(userId)).rejects.toThrow(new NotFoundError('User', userId.toString()));
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });

  });

  //Find a user by Id for the controller 
  describe('Find a user for controller by id', () => {

    it('Should return the userDto of the provided id', async () => {
      const userId = 1;
      userRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findUserById(userId);

      expect(result).toEqual(new UserDto(mockUser));
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: userId
        },
        relations: ['roles']
      });
    });

    it('Should throw a NotFoundError if user is not found', async () => {
      const userId = 1;
      userRepository.findOne.mockResolvedValue(null);

      expect(service.findUserById(userId)).rejects.toThrow(new NotFoundError('User', userId.toString()));
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: userId
        },
        relations: ['roles']
      });
    });

  });

  //Find a user by username
  describe('Find a user by username', () => {

    it('Should return the userDtos of users that match the username', async () => {
      const username = 'username';
      userRepository.find.mockResolvedValue([mockUser]);
      const result = await service.findUserByUsername(username);

      expect(result).toEqual(new UserDto([mockUser][0]));
      expect(userRepository.find).toHaveBeenCalledWith({
        where: {
          username: username,
        },
        relations: ['roles']
      });
    });


    it('Should throw a NotFoundException if no users are found', async () => {
      const username = 'username';
      userRepository.find.mockResolvedValue([]);

      expect(service.findUserByUsername(username)).rejects.toThrow(NotFoundError);
      expect(userRepository.find).toHaveBeenCalledWith({
        where: {
          username: username,
        },
        relations: ['roles']
      });
    });

  });

  //Create a user
  describe('Create a new user', () => {

    it('Should create a user and return the userDto', async () => {
      const savedUser: User = {
        id: 1,
        ...mockCreateUserDto,
        password: await bcrypt.hash(mockCreateUserDto.password, 10),
        roles: [],
        bookReservations: [],
      };

      rolesService.findOneByRoleName.mockResolvedValue({ id: 1, role: 'USER', users: [] });
      userRepository.save.mockResolvedValue(savedUser);

      const result = await service.createUser(mockCreateUserDto);
      expect(result).toEqual(new UserDto(savedUser));
      expect(rolesService.findOneByRoleName).toHaveBeenCalledWith('USER');
      expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        username: mockCreateUserDto.username,
        email: mockCreateUserDto.email,
        roles: [{ id: 1, role: 'USER', users: [] }],
      }));
    })

    it('Should return ConflictException if user or email already exists', async () => {

      class CustomQueryFailedError extends QueryFailedError {
        errno: number;

        constructor(errno: number, code: string) {
          super('', [], { code } as any);
          this.errno = errno;
        }
      }

      userRepository.save.mockRejectedValue(new CustomQueryFailedError(1062, 'ER_DUP_ENTRY'));
      await expect(service.createUser(mockCreateUserDto)).rejects.toThrow(HttpException);
    })
  });

  //Update a user
  describe('Create a new user', () => {

    it('should update the user successfully', async () => {
      const userID = 1;
      userRepository.findOneBy.mockResolvedValue(mockUser);
      userRepository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.updateUser(userID, mockUpdateUserDto);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(userRepository.update).toHaveBeenCalledWith(1, mockUpdateUserDto);
      expect(result).toEqual(`The user with id ${userID} was updated`);
    });

    //User not Found
    it('Should throw NotFoundError when user does not exists', async () => {
      const userId = 1;
      userRepository.findOneBy.mockResolvedValue(null);
      const result = await service.updateUser(userId, {} as UpdateUserDto);
      expect(result).toBeInstanceOf(NotFoundError);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    })

    //Username can not be changed
    it('should throw ForbiddenException is changing username', async () => {
      const userId = 1;

      userRepository.findOneBy.mockResolvedValue(mockUser);
      mockUpdateUserDto.username = "newUsername";


      const result = await service.updateUser(userId, mockUpdateUserDto);
      expect(result).toBeInstanceOf(HttpException);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

  });
});
