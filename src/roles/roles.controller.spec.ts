import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Role } from './entities/role.entity';


describe('RolesController', () => {
  let controller: RolesController;
  let rolesService: RolesService;

  //Mocked role
  const role: Role = {
    id: 1,
    role: 'ADMIN',
    users: []
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            findAll: jest.fn(),
            findOneByID: jest.fn(),
            findOneByRoleName: jest.fn(),
          }
        }
      ],
    })
      //Override ThrottleGuard.
      .overrideGuard(ThrottlerGuard)
      //Moking the response of the guard.
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<RolesController>(RolesController);
    rolesService = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //Find all roles
  it('Should find all roles', async () => {
    jest.spyOn(rolesService, 'findAll').mockResolvedValue([role]);
    const result = await controller.findAll();
    expect(result).toEqual([role]);
    expect(rolesService.findAll).toHaveBeenCalledWith();
  })

  //Find role by Id
  it('Should find a role by Id', async () => {
    const roleId: number = 1;
    jest.spyOn(rolesService, 'findOneByID').mockResolvedValue(role);
    const result = await controller.findOne(roleId);
    expect(result).toEqual(role);
    expect(rolesService.findOneByID).toHaveBeenCalledWith(roleId);
  })

  //Find role by role name
  it('Should find a role by rolename', async () => {
    const roleName = 'ADMIN';
    jest.spyOn(rolesService, 'findOneByRoleName').mockResolvedValue(role);
    const result = await controller.findByRoleNAme(roleName);
    expect(result).toEqual(role);
    expect(rolesService.findOneByRoleName).toHaveBeenCalledWith(roleName);
  })

});
