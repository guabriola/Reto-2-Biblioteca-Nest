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


  async create(newReservation: ReservationDto): Promise<Reservation> {

    const { userId, bookId, startDate, endDate } = newReservation;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`The user with id: ${userId} was not found`);
    }

    const book = await this.bookRepository.findOneBy({ id: bookId });
    if (!book) {
      throw new NotFoundException(`The book with id: ${bookId} was not found`);
    }


    const reservation = this.reservationRepository.create({
      user,
      book,
      startDate,
      endDate,
    });

    //Here the new reservation is created
    const reservationCreated = this.reservationRepository.save(reservation);
    //Only the necessary information should be returned
    return this.reservationRepository.findOne({ where: { id: (await reservationCreated).id } });

  }

  async findAll(params): Promise<Reservation[]> {
    return await this.reservationRepository.find();
  }

  async findReservation(reservationId: string): Promise<ReservationDto> {
    
    const findedReservation = await this.reservationRepository.findOne({
      where: {
        id: parseInt(reservationId)
      },
      relations: {
        user: true,
        book: true,
      }
    });

    let reservationDto = new ReservationDto;
    //Tener en cuenta que tuve que sacarle el readOnly en atrubutos de ReservationDto
    reservationDto.bookId = findedReservation.book.id;
    reservationDto.userId = findedReservation.user.id;
    reservationDto.startDate = findedReservation.startDate;
    reservationDto.endDate = findedReservation.endDate;
    return reservationDto;
  }

  async update(reservationId: string, updateReservation: UpdateReservationDto): Promise<UpdateResult> {

    return this.reservationRepository.update(reservationId, updateReservation)
    //This is another way to doit - Check userUpdate in userService
    // let toUpdate = await this.reservationRepository.findOne({where: { id : parseInt(reservationId)}})
    // let updated = Object.assign(toUpdate, updateReservation);
    // return this.reservationRepository.save(updated);
  }

  async deleteReservation(reservationId: string): Promise<any> {
    return await this.reservationRepository.delete({ id: parseInt(reservationId) });
  }
}
