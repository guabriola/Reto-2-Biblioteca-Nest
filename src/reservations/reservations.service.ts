import { Injectable, NotFoundException } from '@nestjs/common';
import { ReservationDto } from './dto/reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';



@Injectable()
export class ReservationsService {

  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Book) private bookRepository: Repository<Book>
  ) { }

  //Create new Reservation
  async create(newReservation: ReservationDto): Promise<any> {

    const { userId, bookId, startDate, endDate } = newReservation;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`The user with id: ${userId} was not found`);
    }

    const book = await this.bookRepository.findOneBy({ id: bookId });
    if (!book) {
      throw new NotFoundException(`The book with id: ${bookId} was not found`);
    }

    //Creates a new entity instance and copies all entity properties from this object into a new entity. 
    //Note that it copies only properties that are present in entity schema.
    const reservation = this.reservationRepository.create({
      user,
      book,
      startDate,
      endDate,
    });

    
    //Here the new reservation is created
    const reservationCreated = await this.reservationRepository.save(reservation);
    console.log(reservationCreated)
    //Only the necessary information should be returned
    return this.findReservationById(reservation.id.toString())

  }

  //Find All Reservations
  async findAll(params): Promise<any[]> {
    const reservations = await this.reservationRepository.find({
      relations: ['user', 'book'],
    });

    if (reservations.length > 0) {

      return reservations.map(reservation => ({
        id: reservation.id,
        bookId: reservation.book.id,
        userId: reservation.user.id,
        startDate: reservation.startDate,
        endDate: reservation.endDate,

      }))

    } else throw new NotFoundException(`There are no reservations in the Database`);
  }

  //Find a reservation By Id
  async findReservationById(reservationId: string): Promise<ReservationDto> {

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
      throw new NotFoundException(`The reservation with id ${reservationId} is not exist.`);
    }
    //I build a new constructor on reservationDto in order to be able to return a ReservationDto
    return new ReservationDto(findedReservation);
  }

  //Update Reservation -->Id + StartDate + EndDate <--
  async update(reservationId: string, updateReservation: UpdateReservationDto): Promise<UpdateResult> {
    try {
      const findedReservation = await this.findReservationById(reservationId);
      return this.reservationRepository.update(reservationId, updateReservation);

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
