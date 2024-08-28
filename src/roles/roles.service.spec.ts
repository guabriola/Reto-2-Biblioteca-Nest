// roles.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { NotFoundException } from '@nestjs/common';

describe('RolesService', () => {
  let service: RolesService;
  let rolesRepository: jest.Mocked<Repository<Role>>;

  const mockRole: Role = {
    id: 1,
    role: 'ADMIN',
    users: [],
  };

  const mockCreateRoleDto: CreateRoleDto = {
    role: 'USER',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    rolesRepository = module.get(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //Create
  describe('create', () => {
    it('should create and save a new role', async () => {
      rolesRepository.create.mockReturnValue(mockRole);
      rolesRepository.save.mockResolvedValue(mockRole);

      const result = await service.create(mockCreateRoleDto);
      expect(result).toEqual(mockRole);
      expect(rolesRepository.create).toHaveBeenCalledWith(mockCreateRoleDto);
      expect(rolesRepository.save).toHaveBeenCalledWith(mockRole);
    });
  });

  //FindAll
  describe('findAll', () => {
    it('should return an array of roles', async () => {
      rolesRepository.find.mockResolvedValue([mockRole]);

      const result = await service.findAll();
      expect(result).toEqual([mockRole]);
      expect(rolesRepository.find).toHaveBeenCalledWith();
    });
  });

  //FindOneByID
  describe('findOneByID', () => {
    it('should find and return a role by ID', async () => {
      rolesRepository.findOne.mockResolvedValue(mockRole);

      const result = await service.findOneByID(1);
      expect(result).toEqual(mockRole);
      expect(rolesRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if the role is not found by ID', async () => {
      rolesRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneByID(9)).rejects.toThrow(NotFoundException);
      expect(rolesRepository.findOne).toHaveBeenCalledWith({ where: { id: 9 } });
    });
  });

  //FindOneByRoleName
  describe('findOneByRoleName', () => {
    it('should find and return a role by name', async () => {
      rolesRepository.findOne.mockResolvedValue(mockRole);

      const result = await service.findOneByRoleName('ADMIN');
      expect(result).toEqual(mockRole);
      expect(rolesRepository.findOne).toHaveBeenCalledWith({ where: { role: 'ADMIN' } });
    });

    it('should throw NotFoundException if the role is not found by name', async () => {
      rolesRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneByRoleName('NONEXISTENT_ROLE')).rejects.toThrow(NotFoundException);
      expect(rolesRepository.findOne).toHaveBeenCalledWith({ where: { role: 'NONEXISTENT_ROLE' } });
    });
  });
});