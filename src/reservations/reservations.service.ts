import { Injectable, NotFoundException } from '@nestjs/common';
import { ReservationDto } from './dto/reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';
import { CreateReservationDto } from './dto/createReservation.dto';



@Injectable()
export class ReservationsService {

  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Book) private bookRepository: Repository<Book>
  ) { }

  //Create new Reservation
  async create(newReservation: CreateReservationDto): Promise<ReservationDto> {

    const { userId, bookId, startDate, endDate } = newReservation;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`The user with id: ${userId} was not found`);
    }

    const book = await this.bookRepository.findOneBy({ id: bookId });
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

    //Here the new reservation is created and save in the DB
    const reservationCreated = await this.reservationRepository.save(reservation);

    // //Only the necessary information should be returned
    return new ReservationDto(reservationCreated);

  }

  //Find All Reservations
  async findAll(params): Promise<any[]> {
    const reservations = await this.reservationRepository.find({
      relations: ['user', 'book'],
    });

    if (reservations.length > 0) {
      return reservations.map(reservation => (new ReservationDto(reservation)))

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

  //Find a reservation By userId
  async findReservationByUserId(userId: string): Promise<ReservationDto[]> {
    const reservations = await this.reservationRepository.find({
      relations: {
        user: true,
    },
    where: {
        user: {
            id: parseInt(userId),
        },
    },
    });

    return reservations.map(reservation => (new ReservationDto(reservation)))
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
