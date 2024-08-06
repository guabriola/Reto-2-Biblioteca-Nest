import { Injectable, NotFoundException } from '@nestjs/common';
import { ReservationDto } from './dto/reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';
import { CreateReservationDto } from './dto/createReservation.dto';
import { todo } from 'node:test';



@Injectable()
export class ReservationsService {

  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Book) private bookRepository: Repository<Book>
  ) { }

  //Create new Reservation
  async create(newReservation: CreateReservationDto): Promise<ReservationDto> {
    try {
      const { userId, bookId, startDate, endDate } = newReservation;
      // console.log("NewREservaton!!!!!"+ newReservation);
      const user = await this.userRepository.findOneBy({ id: userId });
      // console.log("Userrrrr---->"+user)
      if (!user) {
        throw new NotFoundException(`The user with id: ${userId} was not found`);
      }

      const book = await this.bookRepository.findOneBy({ id: bookId });
      // console.log("Boooooook---->"+book)
      if (!book) {
        throw new NotFoundException(`The book with id: ${bookId} was not found`);
      }

      // Creates a new entity instance and copies all entity properties from this object into a new entity. 
      // Note that it copies only properties that are present in entity schema.
      const reservation = this.reservationRepository.create({
        user,
        book,
        startDate,
        endDate,
      });
      // console.log("REservaton!!!!!!!!!!!!!!!!1" + reservation);
      //Here the new reservation is created and save in the DB
      const reservationCreated = await this.reservationRepository.save(reservation);

      //Only the necessary information should be returned
      return new ReservationDto(reservationCreated);

    } catch (e) {
      todo //El querer crear una nueva reserva:
      //Si el id de usuario o book no existen da el error bien, pero si estan mal los dos
      //solo muestra un error.
      //Si las fechas estan con un mal formato si aparecen la dos, pero no aparecen los
      //errores de id.
      //En resumen los únicos errores que se acumulan y se muestran son los de las fechas. 
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
        throw new NotFoundException(`The reservation with id ${reservationId} doesn't exist.`);
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

      return reservations.map(reservation => ({
        id: reservation.reservation_id,
        bookId: reservation.bookId,
        userId: reservation.userId,
        startDate: reservation.reservation_startDate,
        endDate: reservation.reservation_endDate,
      }
      ));
      
    } catch (e) {
      throw e;
    }
  }

  //Find a reservation By bookId
  async findReservationByBookId(bookId: string): Promise<ReservationDto[]> {
    try {
      const reservations = await this.reservationRepository
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.book', 'book')
        .leftJoinAndSelect('reservation.user', 'user')
        .where('book.id = :bookId', { bookId })
        .select(['reservation.id', 'reservation.startDate', 'reservation.endDate', 'book.id AS bookId', 'user.id AS userId'])
        .getRawMany();

      return reservations.map(reservation => ({
        id: reservation.reservation_id,
        bookId: reservation.bookId,
        userId: reservation.userId,
        startDate: reservation.reservation_startDate,
        endDate: reservation.reservation_endDate,
      }
      ));
    } catch (e) {
      throw e;
    }
  }

  //Update Reservation -->Id + StartDate + EndDate <--
  async update(reservationId: string, updateReservation: UpdateReservationDto): Promise<UpdateResult> {
    try {
      const findedReservation = await this.findReservationById(reservationId);
      return await this.reservationRepository.update(reservationId, updateReservation);

    } catch (e) {
      throw e;
    }
  }

  //Delete Reservation By ID
  async deleteReservation(reservationId: string): Promise<any> {
    try {
      const findedReservation = await this.findReservationById(reservationId);
      return await this.reservationRepository.delete({ id: parseInt(reservationId) });
    } catch (e) {
      throw e;
    }
  }
}
