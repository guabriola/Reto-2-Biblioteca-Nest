import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationDto } from './dto/reservation.dto';

import { Request } from 'express';
import { Reservation } from './entities/reservation.entity';
import { UpdateResult } from 'typeorm';
import { UpdateReservationDto } from './dto/updateReservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Post()
  create(@Body() newReservation: ReservationDto): Promise<Reservation> {
    return this.reservationsService.create(newReservation);
  }

  @Get()
  findAll(@Req() request: Request): Promise<Reservation[]> {
    console.log(request.query);
    return this.reservationsService.findAll(request.query);
  }

  @Get(':reservationId')
  findOne(@Param('reservationId') id: string) {
    return this.reservationsService.findReservationById(id);
  }

  @Put(':reservationId')
  update(@Param('reservationId') id: string, @Body() updateReservationDto: UpdateReservationDto) 
  : Promise<UpdateResult>
  {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':reservationId')
  deleteReservation(@Param('reservationId') id: string): Promise<any>{
    return this.reservationsService.deleteReservation(id);
  }
}
