import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationDto } from './dto/reservation.dto';
import { Request } from 'express';
import { Reservation } from './entities/reservation.entity';
import { UpdateResult } from 'typeorm';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { CreateReservationDto } from './dto/createReservation.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Reservations')
@Controller('reservations')
@UseGuards(ThrottlerGuard) //Applying Rate Limiting
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) { }

  /**
   * Create new reservation
   * */
  @ApiResponse({ status: 404, description: 'The book was not found'})
  @ApiResponse({ status: 404, description: 'The user was not found'})
  @ApiResponse({ status: 500, description: 'Internal Server Error'})
  @Post()
  create(@Body() newReservation: CreateReservationDto): Promise<ReservationDto> {
    return this.reservationsService.create(newReservation);
  }

  /**
   * Get reservation bu reservationId
  */
  @ApiResponse({ status: 404, description: 'The reservation with id  doesnt exist'})
  @Get(':reservationId')
  findOne(@Param('reservationId') id: string) {
    return this.reservationsService.findReservationById(id);
  }

  /**
   * Get all reservations
  */
  @ApiResponse({ status: 404, description: 'There are no reservations in the Database'})
  @Get()
  findAll(@Req() request: Request): Promise<Reservation[]> {
    console.log(request.query);
    return this.reservationsService.findAll(request.query);
  }

  /**
   * Get a reservation by userId
   * */
  @Get('/userId/:userId')
  findByUserId(@Param('userId') userId: string): Promise<ReservationDto[]> {
    return this.reservationsService.findReservationByUserId(userId);
  }

  /**
   * Get reservations bu bookID
   */
  @Get('/bookId/:bookId')
  findByBookId(@Param('bookId') bookId: string): Promise<ReservationDto[]> {
    return this.reservationsService.findReservationByBookId(bookId);
  }

  /**
   * Update reservation
   */ 
  @Put(':reservationId')
  update(@Param('reservationId') id: string, @Body() updateReservationDto: UpdateReservationDto)
    : Promise<UpdateResult> {
    return this.reservationsService.update(id, updateReservationDto);
  }

  /**
   * Delete Reservation
   */
  @Delete(':reservationId')
  deleteReservation(@Param('reservationId') id: string): Promise<any> {
    return this.reservationsService.deleteReservation(id);
  }
}
