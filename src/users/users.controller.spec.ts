import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          //Moking user service
          useValue: {
            findAll: jest 
              .fn()
              .mockResolvedValue([{
                id: '1',
                username: 'admin',
                email: 'admin@admin.com',
                name: 'ADMIN',
                lastName: 'ADMIN'
              }]),
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

  describe('getUsers', () => {
    it('Shoud find all the users', async() => {
      const users = await controller.findAll();
      expect(users).toEqual([{
        id: '1',
        username: 'admin',
        email: 'admin@admin.com',
        name: 'ADMIN',
        lastName: 'ADMIN'
      }])
    })
  })
});