import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RolesService } from 'src/roles/roles.service';
import { ReservationsService } from 'src/reservations/reservations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserDto } from './dto/user.dto';
import { NotFoundException } from '@nestjs/common';
import NotFoundError from 'src/common/errors/not-found.exception';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
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

});
