import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ReservationsService {

  constructor(
    @InjectRepository(Reservation) private reservationRepository : Repository<Reservation>
  ) {}


  create(newReservation: CreateReservationDto): Promise<Reservation> {
    return this.reservationRepository.save(newReservation);
  }

  async findAll(params): Promise <Reservation[]> {
    return await this.reservationRepository.find();
  }

  findOne(reservationId: string) : Promise <Reservation> {
    return await this.reservationRepository.findOne({where: { id : parseInt(reservationId)}});
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
