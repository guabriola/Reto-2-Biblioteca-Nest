import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateReservationDto } from './dto/createReservation.dto';
import { ReservationDto } from './dto/reservation.dto';
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PublicReservationDto } from './dto/publicRservation.dto';
import { UpdateReservationDto } from './dto/updateReservation.dto';


describe('ReservationsController', () => {

  let controller: ReservationsController;
  let reservationsService: ReservationsService;

  //Reservation DTO Mock
  const createReservationDto: CreateReservationDto =
  {
    "userId": 3,
    "bookId": 1,
    "startDate": new Date("2024-08-07"),
    "endDate": new Date("2024-08-11")
  }

  //Reservation DTO Mock
  const reservationDto: ReservationDto =
  {
    "id": 1,
    "userId": 3,
    "bookId": 1,
    "startDate": new Date("2024-08-07"),
    "endDate": new Date("2024-08-11")
  }

  //Public Reservation DTO Mock
  const publicReservationDto: PublicReservationDto =
  {
    "startDate": new Date("2024-08-07"),
    "endDate": new Date("2024-08-11")
  }

  //pdate Reservation DTO
  const updateReservationDto: UpdateReservationDto =
  {
    "startDate": new Date("2024-08-07"),
    "endDate": new Date("2024-08-11")
  }



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          //Moking reservations service
          provide: ReservationsService,
          useValue: {
            availableDate: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findReservationById: jest.fn(),
            findReservationByUserId: jest.fn(),
            findReservationByBookId: jest.fn(),
            findReservationByBookIdPublic: jest.fn(),
            update: jest.fn(),
            deleteReservation: jest.fn(),
          }
        }
      ],
    })
      //Override ThrottleGuard.
      .overrideGuard(ThrottlerGuard)
      //Moking the response of the guard.
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ReservationsController>(ReservationsController);
    reservationsService = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //Create new reservation
  describe('Create new reservation', () => {

    it('Should create and return the reservation', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'create').mockResolvedValue(reservationDto);
      const result = await controller.create(userId, createReservationDto);
      expect(result).toEqual(reservationDto);
      expect(reservationsService.create).toHaveBeenCalledWith(userId, createReservationDto);
    });

    //NotFound
    it('Should throw NotFoundException if user or book are not found', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'create').mockRejectedValue(new NotFoundException());
      await expect(controller.create(userId, createReservationDto)).rejects.toThrow(NotFoundException);
      expect(reservationsService.create).toHaveBeenCalledWith(userId, createReservationDto);
    });

    //Conflict
    it('Should throw ConflictException if book is already booked', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'create').mockRejectedValue(new ConflictException());
      await expect(controller.create(userId, createReservationDto)).rejects.toThrow(ConflictException);
      expect(reservationsService.create).toHaveBeenCalledWith(userId, createReservationDto);
    });

    //Unauthorized
    it('Should throw Unauthorized if the user is not loged', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'create').mockRejectedValue(new UnauthorizedException());
      await expect(controller.create(userId, createReservationDto)).rejects.toThrow(UnauthorizedException);
      expect(reservationsService.create).toHaveBeenCalledWith(userId, createReservationDto);
    });

    //ForbiddenException
    it('Should throw ForbiddenException if is not the user or admin user', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'create').mockRejectedValue(new ForbiddenException());
      await expect(controller.create(userId, createReservationDto)).rejects.toThrow(ForbiddenException);
      expect(reservationsService.create).toHaveBeenCalledWith(userId, createReservationDto);
    });

    //BadRequestException
    it('Should throw BadRequestException if data of the request is not what is expected', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'create').mockRejectedValue(new BadRequestException());
      await expect(controller.create(userId, createReservationDto)).rejects.toThrow(BadRequestException);
      expect(reservationsService.create).toHaveBeenCalledWith(userId, createReservationDto);
    });
  });

  //Find Reservation By ID
  describe('Find Reservation by Id', () => {

    it('Should return a reservation by the id', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'findReservationById').mockResolvedValue(reservationDto);
      const result = await controller.findOne(userId);
      expect(result).toEqual(reservationDto);
      expect(reservationsService.findReservationById).toHaveBeenCalledWith(userId);
    });

    //NotFound
    it('Should throw NotFoundException if reservation is not found', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'findReservationById').mockRejectedValue(new NotFoundException());
      await expect(controller.findOne(userId)).rejects.toThrow(NotFoundException);
      expect(reservationsService.findReservationById).toHaveBeenCalledWith(userId);
    });

    //Unauthorized
    it('Should throw Unauthorized if the user is not loged', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'findReservationById').mockRejectedValue(new UnauthorizedException());
      await expect(controller.findOne(userId)).rejects.toThrow(UnauthorizedException);
      expect(reservationsService.findReservationById).toHaveBeenCalledWith(userId);
    });

    //ForbiddenException
    it('Should throw ForbiddenException if is not the user or admin user', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'findReservationById').mockRejectedValue(new ForbiddenException());
      await expect(controller.findOne(userId)).rejects.toThrow(ForbiddenException);
      expect(reservationsService.findReservationById).toHaveBeenCalledWith(userId);
    });

    //BadRequestException
    it('Should throw BadRequestException if Id is not numeric string', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'findReservationById').mockRejectedValue(new BadRequestException());
      await expect(controller.findOne(userId)).rejects.toThrow(BadRequestException);
      expect(reservationsService.findReservationById).toHaveBeenCalledWith(userId);
    });

  });


  //Get all reservations
  describe('Get all reservations', () => {

    it('Should return all reservations', async () => {
      jest.spyOn(reservationsService, 'findAll').mockResolvedValue([reservationDto]);
      const result = await controller.findAll();
      expect(result).toEqual([reservationDto]);
      expect(reservationsService.findAll).toHaveBeenCalledWith();
    });

    //NotFound
    it('Should throw NotFoundException if there is not reservations', async () => {

      jest.spyOn(reservationsService, 'findAll').mockRejectedValue(new NotFoundException());
      await expect(controller.findAll()).rejects.toThrow(NotFoundException);
      expect(reservationsService.findAll).toHaveBeenCalledWith();
    });

    //Unauthorized
    it('Should throw Unauthorized if the user is not loged', async () => {
      jest.spyOn(reservationsService, 'findAll').mockRejectedValue(new UnauthorizedException());
      await expect(controller.findAll()).rejects.toThrow(UnauthorizedException);
      expect(reservationsService.findAll).toHaveBeenCalledWith();
    });

    //ForbiddenException
    it('Should throw ForbiddenException if is not ADMIN user', async () => {
      jest.spyOn(reservationsService, 'findAll').mockRejectedValue(new ForbiddenException());
      await expect(controller.findAll()).rejects.toThrow(ForbiddenException);
      expect(reservationsService.findAll).toHaveBeenCalledWith();
    });

  });

  //Get a reservation by userId
  describe('Get a reservation by userId', () => {

    it('Should return all reservations of the user with specified userId', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'findReservationByUserId').mockResolvedValue([reservationDto]);
      const result = await controller.findByUserId(userId);
      expect(result).toEqual([reservationDto]);
      expect(reservationsService.findReservationByUserId).toHaveBeenCalledWith(userId);
    });

    //NotFound
    it('Should throw NotFoundException if there is not reservations', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'findReservationByUserId').mockRejectedValue(new NotFoundException());
      await expect(controller.findByUserId(userId)).rejects.toThrow(NotFoundException);
      expect(reservationsService.findReservationByUserId).toHaveBeenCalledWith(userId);
    });

    //Unauthorized
    it('Should throw Unauthorized if the user is not loged', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'findReservationByUserId').mockRejectedValue(new UnauthorizedException());
      await expect(controller.findByUserId(userId)).rejects.toThrow(UnauthorizedException);
      expect(reservationsService.findReservationByUserId).toHaveBeenCalledWith(userId);
    });

    //ForbiddenException
    it('Should throw ForbiddenException if is not owner user or ADMIN user', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'findReservationByUserId').mockRejectedValue(new ForbiddenException());
      await expect(controller.findByUserId(userId)).rejects.toThrow(ForbiddenException);
      expect(reservationsService.findReservationByUserId).toHaveBeenCalledWith(userId);
    });

    //BadRequestException
    it('Should throw BadRequestException if Id is not numeric string', async () => {
      const userId = 1;
      jest.spyOn(reservationsService, 'findReservationByUserId').mockRejectedValue(new BadRequestException());
      await expect(controller.findByUserId(userId)).rejects.toThrow(BadRequestException);
      expect(reservationsService.findReservationByUserId).toHaveBeenCalledWith(userId);
    });

  });

  //Get reservations by bookID - Admin and User Access
  describe('Get reservations by bookID - Admin and User Access', () => {

    it('Should return all reservations of a specific book ', async () => {
      const bookId = 1;
      jest.spyOn(reservationsService, 'findReservationByBookId').mockResolvedValue([reservationDto]);
      const result = await controller.findByBookId(bookId);
      expect(result).toEqual([reservationDto]);
      expect(reservationsService.findReservationByBookId).toHaveBeenCalledWith(bookId);
    });

    //NotFound
    it('Should throw NotFoundException if there is not reservations', async () => {
      const bookId = 1;
      jest.spyOn(reservationsService, 'findReservationByBookId').mockRejectedValue(new NotFoundException());
      await expect(controller.findByBookId(bookId)).rejects.toThrow(NotFoundException);
      expect(reservationsService.findReservationByBookId).toHaveBeenCalledWith(bookId);
    });

    //Unauthorized
    it('Should throw Unauthorized if the user is not loged', async () => {
      const bookId = 1;
      jest.spyOn(reservationsService, 'findReservationByBookId').mockRejectedValue(new UnauthorizedException());
      await expect(controller.findByBookId(bookId)).rejects.toThrow(UnauthorizedException);
      expect(reservationsService.findReservationByBookId).toHaveBeenCalledWith(bookId);
    });

    //ForbiddenException
    it('Should throw ForbiddenException if is not owner user or ADMIN user', async () => {
      const bookId = 1;
      jest.spyOn(reservationsService, 'findReservationByBookId').mockRejectedValue(new ForbiddenException());
      await expect(controller.findByBookId(bookId)).rejects.toThrow(ForbiddenException);
      expect(reservationsService.findReservationByBookId).toHaveBeenCalledWith(bookId);
    });

    //BadRequestException
    it('Should throw BadRequestException if Id is not numeric string', async () => {
      const bookId = 1;
      jest.spyOn(reservationsService, 'findReservationByBookId').mockRejectedValue(new BadRequestException());
      await expect(controller.findByBookId(bookId)).rejects.toThrow(BadRequestException);
      expect(reservationsService.findReservationByBookId).toHaveBeenCalledWith(bookId);
    });

  });


  //Get reservations by bookID - Public Access
  describe('Get reservations by bookID - Public access', () => {

    it('Should return all reservations of a specific book ', async () => {
      const bookId = 1;
      jest.spyOn(reservationsService, 'findReservationByBookIdPublic').mockResolvedValue([publicReservationDto]);
      const result = await controller.publicFindByBookId(bookId);
      expect(result).toEqual([publicReservationDto]);
      expect(reservationsService.findReservationByBookIdPublic).toHaveBeenCalledWith(bookId);
    });

    //NotFound
    it('Should throw NotFoundException if there is not reservations', async () => {
      const bookId = 1;
      jest.spyOn(reservationsService, 'findReservationByBookIdPublic').mockRejectedValue(new NotFoundException());
      await expect(controller.publicFindByBookId(bookId)).rejects.toThrow(NotFoundException);
      expect(reservationsService.findReservationByBookIdPublic).toHaveBeenCalledWith(bookId);
    });

    //Unauthorized
    it('Should throw Unauthorized if the user is not loged', async () => {
      const bookId = 1;
      jest.spyOn(reservationsService, 'findReservationByBookIdPublic').mockRejectedValue(new UnauthorizedException());
      await expect(controller.publicFindByBookId(bookId)).rejects.toThrow(UnauthorizedException);
      expect(reservationsService.findReservationByBookIdPublic).toHaveBeenCalledWith(bookId);
    });

    //ForbiddenException
    it('Should throw ForbiddenException if is not owner user or ADMIN user', async () => {
      const bookId = 1;
      jest.spyOn(reservationsService, 'findReservationByBookIdPublic').mockRejectedValue(new ForbiddenException());
      await expect(controller.publicFindByBookId(bookId)).rejects.toThrow(ForbiddenException);
      expect(reservationsService.findReservationByBookIdPublic).toHaveBeenCalledWith(bookId);
    });

    //BadRequestException
    it('Should throw BadRequestException if Id is not numeric string', async () => {
      const bookId = 1;
      jest.spyOn(reservationsService, 'findReservationByBookIdPublic').mockRejectedValue(new BadRequestException());
      await expect(controller.publicFindByBookId(bookId)).rejects.toThrow(BadRequestException);
      expect(reservationsService.findReservationByBookIdPublic).toHaveBeenCalledWith(bookId);
    });

  });

  //Update reservation
  describe('Update reservation', () => {

    it('Should return message - The reservation was updated.', async () => {
      const bookId = 1;
      const userId = 1;
      const message = 'The reservation was updated.'
      jest.spyOn(reservationsService, 'update').mockResolvedValue(message);
      const result = await controller.update(userId, bookId, updateReservationDto);
      expect(result).toEqual(message);
      expect(reservationsService.update).toHaveBeenCalledWith(userId, bookId, updateReservationDto);
    });

    //NotFound
    it('Should throw NotFoundException if there is not reservations', async () => {
      const bookId = 1;
      const userId = 1;
      jest.spyOn(reservationsService, 'update').mockRejectedValue(new NotFoundException());
      await expect(controller.update(userId, bookId, updateReservationDto)).rejects.toThrow(NotFoundException);
      expect(reservationsService.update).toHaveBeenCalledWith(userId, bookId, updateReservationDto);
    });

    //Unauthorized
    it('Should throw Unauthorized if the user is not loged', async () => {
      const bookId = 1;
      const userId = 1;
      jest.spyOn(reservationsService, 'update').mockRejectedValue(new UnauthorizedException());
      await expect(controller.update(userId, bookId, updateReservationDto)).rejects.toThrow(UnauthorizedException);
      expect(reservationsService.update).toHaveBeenCalledWith(userId, bookId, updateReservationDto);
    });

    //ForbiddenException
    it('Should throw ForbiddenException if is not owner user or ADMIN user', async () => {
      const bookId = 1;
      const userId = 1;
      jest.spyOn(reservationsService, 'update').mockRejectedValue(new ForbiddenException());
      await expect(controller.update(userId, bookId, updateReservationDto)).rejects.toThrow(ForbiddenException);
      expect(reservationsService.update).toHaveBeenCalledWith(userId, bookId, updateReservationDto);
    });

    //BadRequestException
    it('Should throw BadRequestException if Id is not numeric string', async () => {
      const bookId = 1;
      const userId = 1;
      jest.spyOn(reservationsService, 'update').mockRejectedValue(new BadRequestException());
      await expect(controller.update(userId, bookId, updateReservationDto)).rejects.toThrow(BadRequestException);
      expect(reservationsService.update).toHaveBeenCalledWith(userId, bookId, updateReservationDto);
    });

  });


  //Delete reservation 
  describe('Delete reservation', () => {

    it('Should return message - The reservation was deleted.', async () => {
      const userId = 1;
      const reservationId = 1;
      const message = 'The reservation was deleted.'
      jest.spyOn(reservationsService, 'deleteReservation').mockResolvedValue(message);
      const result = await controller.deleteReservation(userId, reservationId);
      expect(result).toEqual(message);
      expect(reservationsService.deleteReservation).toHaveBeenCalledWith(userId, reservationId);
    });

    //NotFound
    it('Should throw NotFoundException if there is not reservations', async () => {
      const userId = 1;
      const reservationId = 1;
      jest.spyOn(reservationsService, 'deleteReservation').mockRejectedValue(new NotFoundException());
      await expect(controller.deleteReservation(userId, reservationId)).rejects.toThrow(NotFoundException);
      expect(reservationsService.deleteReservation).toHaveBeenCalledWith(userId, reservationId);
    });

    //Unauthorized
    it('Should throw Unauthorized if the user is not loged', async () => {
      const userId = 1;
      const reservationId = 1;
      jest.spyOn(reservationsService, 'deleteReservation').mockRejectedValue(new UnauthorizedException());
      await expect(controller.deleteReservation(userId, reservationId)).rejects.toThrow(UnauthorizedException);
      expect(reservationsService.deleteReservation).toHaveBeenCalledWith(userId, reservationId);
    });

    //ForbiddenException
    it('Should throw ForbiddenException if is not owner user or ADMIN user', async () => {
      const userId = 1;
      const reservationId = 1;
      jest.spyOn(reservationsService, 'deleteReservation').mockRejectedValue(new ForbiddenException());
      await expect(controller.deleteReservation(userId, reservationId)).rejects.toThrow(ForbiddenException);
      expect(reservationsService.deleteReservation).toHaveBeenCalledWith(userId, reservationId);
    });

    //BadRequestException
    it('Should throw BadRequestException if Id is not numeric string', async () => {
      const userId = 1;
      const reservationId = 1;
      jest.spyOn(reservationsService, 'deleteReservation').mockRejectedValue(new BadRequestException());
      await expect(controller.deleteReservation(userId, reservationId)).rejects.toThrow(BadRequestException);
      expect(reservationsService.deleteReservation).toHaveBeenCalledWith(userId, reservationId);
    });

  });
});
