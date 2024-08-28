import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { LoginDto } from './dto/loginDto.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UsersService;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockUserService = {
    createUser: jest.fn(),
  };

  const mockUser: UserDto = {
    id: 1,
    username: 'testuser',
    email: 'testuser@example.com',
    name: 'Test',
    lastName: 'User',
    roles: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new user and return user data', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password',
        name: 'New',
        lastName: 'User',
        roles: [],
      };

      mockUserService.createUser.mockResolvedValue(mockUser);

      const result = await authController.signup(createUserDto);
      expect(result).toEqual(mockUser);
      expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle errors thrown by UsersService', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password',
        name: 'New',
        lastName: 'User',
        roles: [],
      };
      const error = new Error('User creation failed');

      mockUserService.createUser.mockRejectedValue(error);

      await expect(authController.signup(createUserDto)).rejects.toThrow(error);
      expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'testpassword' };
      const req = { user: mockUser };
      const result = { access_token: 'token' };

      mockAuthService.login.mockResolvedValue(result);

      expect(await authController.login(req)).toBe(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should handle errors thrown by AuthService during login', async () => {
      const req = { user: mockUser };
      const error = new UnauthorizedException('Unauthorized');

      mockAuthService.login.mockRejectedValue(error);

      await expect(authController.login(req)).rejects.toThrow(error);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('Guards and Decorators', () => {
    it('should have Public decorator on signup method', () => {
      const isPublic = Reflect.getMetadata('isPublic', authController.signup);
      expect(isPublic).toBe(true);
    });

    it('should have LocalAuthGuard applied on login method', () => {
      const guards = Reflect.getMetadata('__guards__', authController.login);
      const guardInstance = new guards[0]();

      expect(guardInstance).toBeInstanceOf(LocalAuthGuard);
    });
  });
});