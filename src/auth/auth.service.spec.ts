import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findUserByUsername: jest.fn(),
    findUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUser = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    roles: [{ id: 1, role: 'USER' }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should not throw any error if password matches', async () => {
      mockUsersService.findUserByUsername.mockResolvedValue({ id: 1, username: 'testuser' });
      mockUsersService.findUser.mockResolvedValue({ ...mockUser, password: 'hashedpassword' });

      await expect(authService.signIn('testuser', 'hashedpassword')).resolves.toBeUndefined();
      expect(mockUsersService.findUserByUsername).toHaveBeenCalledWith('testuser');
      expect(mockUsersService.findUser).toHaveBeenCalledWith(1);
    });

  });

  describe('login', () => {
    it('should return a valid access token', async () => {
      mockUsersService.findUserByUsername.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('testtoken');

      const result = await authService.login({ username: 'testuser' });
      expect(result).toEqual({ access_token: 'testtoken' });
      expect(mockUsersService.findUserByUsername).toHaveBeenCalledWith('testuser');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: 'testuser',
        sub: 1,
        roles: ['USER'],
      });
    });
  });
});