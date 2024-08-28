import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';
import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateReservationDto } from './dto/createReservation.dto';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { ReservationDto } from './dto/reservation.dto';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationRepository: jest.Mocked<Repository<Reservation>>;
  let userRepository: jest.Mocked<Repository<User>>;
  let bookRepository: jest.Mocked<Repository<Book>>;

  const mockReservation: Reservation = {
    id: 1,
    user: { id: 1, username: 'user1' } as User,
    book: { id: 1, title: 'Book1' } as Book,
    startDate: new Date('2024-08-01'),
    endDate: new Date('2024-08-10'),
  };

  const mockCreateReservationDto: CreateReservationDto = {
    userId: 1,
    bookId: 1,
    startDate: new Date('2024-08-01'),
    endDate: new Date('2024-08-10'),
  };

  const mockUpdateReservationDto: UpdateReservationDto = {
    startDate: new Date('2024-08-05'),
    endDate: new Date('2024-08-15'),
  };

  const mockCreateQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
    getRawMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            create: jest.fn().mockImplementation((reservation) => reservation), // Mockeando el método create
            createQueryBuilder: jest.fn(() => mockCreateQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Book),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    reservationRepository = module.get(getRepositoryToken(Reservation));
    userRepository = module.get(getRepositoryToken(User));
    bookRepository = module.get(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //createReservation
  describe('createReservation', () => {
    it('should create and return a reservation', async () => {
      userRepository.findOneBy.mockResolvedValue({ id: 1 } as User);
      bookRepository.findOneBy.mockResolvedValue({ id: 1 } as Book);
      reservationRepository.create.mockReturnValue(mockReservation); // Usando el mock de create
      reservationRepository.save.mockResolvedValue(mockReservation);
      mockCreateQueryBuilder.getCount.mockResolvedValue(0);

      const result = await service.create(1, mockCreateReservationDto);
      expect(result).toEqual(new ReservationDto(mockReservation));
      expect(reservationRepository.create).toHaveBeenCalledWith(expect.any(Object));
      expect(reservationRepository.save).toHaveBeenCalledWith(mockReservation);
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      await expect(service.create(1, mockCreateReservationDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if book is not found', async () => {
      userRepository.findOneBy.mockResolvedValue({ id: 1 } as User);
      bookRepository.findOneBy.mockResolvedValue(null);
      await expect(service.create(1, mockCreateReservationDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if the book is not available for the selected dates', async () => {
      userRepository.findOneBy.mockResolvedValue({ id: 1 } as User);
      bookRepository.findOneBy.mockResolvedValue({ id: 1 } as Book);
      mockCreateQueryBuilder.getCount.mockResolvedValue(1);

      await expect(service.create(1, mockCreateReservationDto)).rejects.toThrow(HttpException);
    });

    it('should throw HttpException if user ID does not match paramUserId', async () => {
      await expect(service.create(2, mockCreateReservationDto)).rejects.toThrow(HttpException);
    });
  });

  //findAll
  describe('findAll', () => {
    it('should return an array of reservations', async () => {
      reservationRepository.find.mockResolvedValue([mockReservation]);

      const result = await service.findAll();
      expect(result).toEqual([new ReservationDto(mockReservation)]);
    });

    it('should throw NotFoundException if no reservations are found', async () => {
      reservationRepository.find.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  //findReservationById
  describe('findReservationById', () => {
    it('should return a reservation by ID', async () => {
      reservationRepository.findOne.mockResolvedValue(mockReservation);
      const result = await service.findReservationById(1);
      expect(result).toEqual(new ReservationDto(mockReservation));
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      reservationRepository.findOne.mockResolvedValue(null);
      await expect(service.findReservationById(1)).rejects.toThrow(NotFoundException);
    });
  });

  //findReservationByUserId
  describe('findReservationByUserId', () => {
    it('should return reservations for a user', async () => {
      const reservations = [mockReservation];
      mockCreateQueryBuilder.getRawMany.mockResolvedValue(reservations);

      const result = await service.findReservationByUserId(1);
      expect(result).toEqual(expect.any(Array));
    });

    it('should throw NotFoundException if no reservations are found', async () => {
      mockCreateQueryBuilder.getRawMany.mockResolvedValue([]);
      await expect(service.findReservationByUserId(1)).rejects.toThrow(NotFoundException);
    });
  });

  //findReservationByBookId
  describe('findReservationByBookId', () => {
    it('should return reservations for a book', async () => {
      const reservations = [mockReservation];
      mockCreateQueryBuilder.getRawMany.mockResolvedValue(reservations);

      const result = await service.findReservationByBookId(1);
      expect(result).toEqual(expect.any(Array));
    });

    it('should throw NotFoundException if no reservations are found', async () => {
      mockCreateQueryBuilder.getRawMany.mockResolvedValue([]);
      await expect(service.findReservationByBookId(1)).rejects.toThrow(NotFoundException);
    });
  });

  //findReservationByBookIdPublic
  describe('findReservationByBookIdPublic', () => {
    it('should return public reservations for a book', async () => {
      const reservations = [{ startDate: new Date(), endDate: new Date() }];
      mockCreateQueryBuilder.getRawMany.mockResolvedValue(reservations);

      const result = await service.findReservationByBookIdPublic(1);
      expect(result).toEqual(expect.any(Array));
    });

    it('should throw NotFoundException if no public reservations are found', async () => {
      mockCreateQueryBuilder.getRawMany.mockResolvedValue([]);
      await expect(service.findReservationByBookIdPublic(1)).rejects.toThrow(NotFoundException);
    });
  });

  //update
  describe('update', () => {
    it('should update a reservation successfully', async () => {
      reservationRepository.findOne.mockResolvedValue(mockReservation);
      reservationRepository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.update(1, 1, mockUpdateReservationDto);
      expect(result).toEqual("The reservation was updated");
      expect(reservationRepository.update).toHaveBeenCalledWith(1, mockUpdateReservationDto);
    });

    it('should throw BadRequestException if update operation fails', async () => {
      reservationRepository.update.mockResolvedValue({ affected: 0 } as any);

      await expect(service.update(1, 1, mockUpdateReservationDto)).rejects.toThrow(HttpException);
    });

    it('should throw HttpException if user ID does not match reservation userId', async () => {
      reservationRepository.findOne.mockResolvedValue(mockReservation);
      await expect(service.update(2, 1, mockUpdateReservationDto)).rejects.toThrow(HttpException);
    });
  });

  //deleteReservation
  describe('deleteReservation', () => {
    it('should delete a reservation successfully', async () => {
      reservationRepository.findOne.mockResolvedValue(mockReservation);
      reservationRepository.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await service.deleteReservation(1, 1);
      expect(result).toEqual("The reservation was deleted.");
      expect(reservationRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw BadRequestException if delete operation fails', async () => {
      reservationRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.deleteReservation(1, 1)).rejects.toThrow(HttpException);
    });

    it('should throw HttpException if user ID does not match reservation userId', async () => {
      reservationRepository.findOne.mockResolvedValue(mockReservation);
      await expect(service.deleteReservation(2, 1)).rejects.toThrow(HttpException);
    });
  });
});