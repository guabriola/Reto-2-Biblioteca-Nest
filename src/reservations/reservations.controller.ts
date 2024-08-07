import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationDto } from './dto/reservation.dto';
import { Request } from 'express';
import { Reservation } from './entities/reservation.entity';
import { UpdateResult } from 'typeorm';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { CreateReservationDto } from './dto/createReservation.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { HasRoles } from 'src/common/decorators/has.roles.decorator';

@ApiBearerAuth()
@ApiTags('Reservations')
@Controller('reservations')
@UseGuards(ThrottlerGuard, RolesGuard) //Applying Rate Limiting And RolesGuard
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) { }

  @ApiOperation({
    summary: 'Create new reservation',
    description: `
    Rules:
    1 - Start day can not be in the past.\n
    2 - End day must be after start day.\n
    3 - Reservation must be at least one day.\n
    4 - Reservation must be maximum thirty days.
    `,
  })
  @ApiResponse({ status: 400, description: 'Start day can not be in the past.'})
  @ApiResponse({ status: 400, description: 'End day must be after start day.'})
  @ApiResponse({ status: 400, description: 'Reservation must be at least one day.'})
  @ApiResponse({ status: 400, description: 'Reservation must be maximum thirty days.'})
  @ApiResponse({ status: 404, description: 'The book was not found'})
  @ApiResponse({ status: 404, description: 'The user was not found'})
  @ApiResponse({ status: 409, description: 'The book is not available for the selected dates'})
  @ApiResponse({ status: 500, description: 'Internal Server Error'})
  @ApiBearerAuth()
  @HasRoles('ADMIN', 'USER')
  @Post()
  create(@Body() newReservation: CreateReservationDto): Promise<ReservationDto> {
    return this.reservationsService.create(newReservation);
  }

  /**
   * Get reservation by reservationId
  */
  @ApiOperation({
    summary: 'Get reservation by reservationId',
    description: `Get reservation by reservationId
    `,
  })
  @ApiResponse({ status: 404, description: 'The reservation with id  doesnt exist'})
  @ApiBearerAuth()
  @HasRoles('ADMIN', 'USER')
  @Get(':reservationId')
  findOne(@Param('reservationId') id: string) {
    return this.reservationsService.findReservationById(id);
  }

  /**
   * Get all reservations
  */
  @ApiOperation({
    summary: 'Get all reservations',
  })
  @ApiResponse({ status: 404, description: 'There are no reservations in the Database'})
  @ApiBearerAuth()
  @HasRoles('ADMIN')
  @Get()
  findAll(@Req() request: Request): Promise<Reservation[]> {

    return this.reservationsService.findAll(request.query);
  }

  /**
   * Get a reservation by userId
   * */
  @ApiOperation({
    summary: 'Get a reservation by userId',
  })
  @ApiBearerAuth()
  @HasRoles('ADMIN', 'USER')
  @Get('/userId/:userId')
  findByUserId(@Param('userId') userId: string): Promise<ReservationDto[]> {
    return this.reservationsService.findReservationByUserId(userId);
  }

  /**
   * Get reservations by bookID
   */
  @ApiOperation({
    summary: 'Get reservations by bookID',
  })
  @ApiBearerAuth()
  @HasRoles('ADMIN', 'USER')
  @Get('/bookId/:bookId')
  findByBookId(@Param('bookId') bookId: string): Promise<ReservationDto[]> {
    return this.reservationsService.findReservationByBookId(bookId);
  }

  /**
   * Update reservation
   */
  @ApiOperation({
    summary: 'Update reservation',
  })
  @ApiBearerAuth()
  @HasRoles('ADMIN', 'USER')
  @Put(':reservationId')
  update(@Param('reservationId') id: string, @Body() updateReservationDto: UpdateReservationDto)
    : Promise<UpdateResult> {
    return this.reservationsService.update(id, updateReservationDto);
  }

  /**
   * Delete Reservation
   */
  @ApiOperation({
    summary: 'Delete Reservation',
  })
  @ApiBearerAuth()
  @HasRoles('ADMIN', 'USER')
  @Delete(':reservationId')
  deleteReservation(@Param('reservationId') id: string): Promise<any> {
    return this.reservationsService.deleteReservation(id);
  }
}
