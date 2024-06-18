import { Injectable } from '@nestjs/common';
import { ReservationDto } from './dto/reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ReservationsService {

  constructor(
    @InjectRepository(Reservation) private reservationRepository : Repository<Reservation>
  ) {}


  create(newReservation: ReservationDto): Promise<Reservation> {
    return this.reservationRepository.save(newReservation);
  }

  async findAll(params): Promise <Reservation[]> {
    return await this.reservationRepository.find();
  }

  async findReservation(reservationId: string) : Promise <Reservation> {
    return await this.reservationRepository.findOne({where: { id : parseInt(reservationId)}});
  }

  async update(reservationId: string, updateReservation: ReservationDto) {
    let toUpdate = await this.reservationRepository.findOne({where: { id : parseInt(reservationId)}})
    let updated = Object.assign(toUpdate, updateReservation);
    return this.reservationRepository.save(updated);
  }

  async deleteReservation(reservationId: string) : Promise<any>{
    return await this.reservationRepository.delete({ id : parseInt(reservationId)});
  }
}
