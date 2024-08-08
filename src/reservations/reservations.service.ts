import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ReservationDto } from './dto/reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository, ReturningStatementNotSupportedError, UpdateResult } from 'typeorm';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';
import { CreateReservationDto } from './dto/createReservation.dto';
import { todo } from 'node:test';
import { retry } from 'rxjs';
import { PublicReservationDto } from './dto/publicRservation.dto';



@Injectable()
export class ReservationsService {

  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Book) private bookRepository: Repository<Book>
  ) { }

  //Check available reservation date for bookId
  async availableDate(bookId: number, startDate: Date, endDate: Date): Promise<boolean> {
    const bookIsBooked = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.bookId = :bookId', { bookId })
      .andWhere('reservation.startDate <= :endDate', { endDate })
      .andWhere('reservation.endDate >= :startDate', { startDate })
      .getCount();

    console.log(bookIsBooked);

    if (bookIsBooked === 0) {
      return false;
    } else return true;
  }

  //Create new Reservation
  async create(newReservation: CreateReservationDto): Promise<ReservationDto> {
    try {
      const { userId, bookId, startDate, endDate } = newReservation;
      const user = await this.userRepository.findOneBy({ id: userId });
      const book = await this.bookRepository.findOneBy({ id: bookId });
      //Verifying if book is booked in that dates.
      const isBooked = await this.availableDate(
        newReservation.bookId,
        newReservation.startDate,
        newReservation.endDate)
      let errors: string = "";
      //User exists?
      if (!user) {
        throw new NotFoundException(`The user with id: ${userId} was not found`);
      }

      //Book exists?
      if (!book) {
        throw new NotFoundException(`The book with id: ${bookId} was not found`);
      }

      if (isBooked) {
        throw new HttpException('The book is not available for the selected dates',
          HttpStatus.CONFLICT);

      } else {
        // Creates a new entity instance and copies all entity properties from this object into a new entity. 
        // Note that it copies only properties that are present in entity schema.
        const reservation = this.reservationRepository.create({
          user,
          book,
          startDate,
          endDate,
        });

        //Here the new reservation is created and save in the DB
        const reservationCreated = await this.reservationRepository.save(reservation);

        //Only the necessary information should be returned
        return new ReservationDto(reservationCreated);
      }

    } catch (e) {
      todo //Los errores que se dan por el DTO no se acumulan con los que son lanzados en el service. 
      throw e;
    }
  }

  //Find All Reservations
  async findAll(params): Promise<any[]> {
    try {
      const reservations = await this.reservationRepository.find({
        relations: ['user', 'book'],
      });
      if (reservations.length > 0) {
        return reservations.map(reservation => (new ReservationDto(reservation)))

      } else throw new NotFoundException(`There are no reservations in the Database`);
    } catch (e) {
      throw e;
    }
  }

  //Find a reservation By Id
  async findReservationById(reservationId: string): Promise<ReservationDto> {
    try {
      const findedReservation = await this.reservationRepository.findOne({
        where: {
          id: parseInt(reservationId)
        },
        relations: {
          user: true,
          book: true,
        }
      });

      if (!findedReservation) {
        throw new NotFoundException(`The reservation with id ${reservationId} does not exist.`);
      }
      //I build a new constructor on reservationDto in order to be able to return a ReservationDto
      //Other way is with .map
      return new ReservationDto(findedReservation);
    } catch (e) {
      throw e;
    }
  }

  //Find a reservation By userId

  async findReservationByUserId(userId: string): Promise<ReservationDto[]> {
    try {
      const reservations = await this.reservationRepository
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.book', 'book')
        .leftJoinAndSelect('reservation.user', 'user')
        .where('user.id = :userId', { userId })
        .select(['reservation.id', 'reservation.startDate', 'reservation.endDate', 'book.id AS bookId', 'user.id AS userId'])
        .getRawMany();

      reservations.map(reservation => ({
        id: reservation.reservation_id,
        bookId: reservation.bookId,
        userId: reservation.userId,
        startDate: reservation.reservation_startDate,
        endDate: reservation.reservation_endDate,
      }
      ));

      if (reservations.length === 0) {
        throw new NotFoundException(`User does not haver reservations`);
      } else {
        return reservations;
      }

    } catch (e) {
      throw e;
    }
  }

  //Find a reservation By bookId with complete data
  async findReservationByBookId(bookId: string): Promise<ReservationDto[]> {
    try {
      const reservations = await this.reservationRepository
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.book', 'book')
        .leftJoinAndSelect('reservation.user', 'user')
        .where('book.id = :bookId', { bookId })
        .select(['reservation.id', 'reservation.startDate', 'reservation.endDate', 'book.id AS bookId', 'user.id AS userId'])
        .getRawMany();

      reservations.map(reservation => ({
        id: reservation.reservation_id,
        bookId: reservation.bookId,
        userId: reservation.userId,
        startDate: reservation.reservation_startDate,
        endDate: reservation.reservation_endDate,
      }
      ));

      if (reservations.length === 0) {
        throw new NotFoundException(`The book does not haver reservations`);
      } else {
        return reservations;
      }

    } catch (e) {
      throw e;
    }
  }

  // Find a reservation By bookId for public access.
  async findReservationByBookIdPublic(bookId: string): Promise<PublicReservationDto[]> {
    try {
      const reservations = await this.reservationRepository
        .createQueryBuilder('reservation')
        .leftJoin('reservation.book', 'book')
        .where('book.id = :bookId', { bookId })
        .select([
          'reservation.startDate AS startDate',
          'reservation.endDate AS endDate'
        ])
        .getRawMany();

      console.log(reservations); // Agrega este log para verificar los resultados

      const publicReservations = reservations.map(reservation => new PublicReservationDto({
        startDate: reservation.startDate,
        endDate: reservation.endDate,
      }));

      if (publicReservations.length === 0) {
        throw new NotFoundException(`The book does not have reservations`);
      } else {
        return publicReservations;
      }
    } catch (e) {
      throw e;
    }
  }

  //Update Reservation -->userId (for authorization) + reservationId + StartDate + EndDate <--
  async update(reservationId: string, updateReservation: UpdateReservationDto): Promise<any> {
    try {
      //Check if reservation exists
      await this.findReservationById(reservationId);

      const response = await this.reservationRepository.update(reservationId, updateReservation);

      if (response.affected != 1) {
        throw new HttpException({
          error: `ERROR - Something has happend`
        }, HttpStatus.BAD_REQUEST)
      }
      return "The reservation was updated";
    } catch (e) {
      throw e;
    }
  }

  //Delete Reservation By ID -->userId (for authorization) + reservationId
  async deleteReservation(reservationId: string): Promise<any> {
    try {
      //Check if reservation exists
      await this.findReservationById(reservationId);

      const response = await this.reservationRepository.delete({ id: parseInt(reservationId) });
    
      if (response.affected != 1) {
        throw new HttpException({
          error: `ERROR - Something has happend`
        }, HttpStatus.BAD_REQUEST)
      }
      return "The reservation was deleted.";
    
    } catch (e) {
      throw e;
    }
  }
}
