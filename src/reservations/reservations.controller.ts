import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationDto } from './dto/reservation.dto';
import { Request } from 'express';
import { Reservation } from './entities/reservation.entity';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { CreateReservationDto } from './dto/createReservation.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard, SelfOrAdminGuard } from 'src/auth/guards/roles.guard';
import { HasRoles } from 'src/common/decorators/has.roles.decorator';
import { Public } from 'src/common/decorators/public-auth.decorator';
import { PublicReservationDto } from './dto/publicRservation.dto';

@ApiBearerAuth()
@ApiTags('Reservations')
@Controller('reservations')
@UseGuards(ThrottlerGuard, RolesGuard) //Applying Rate Limiting And RolesGuard
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) { }

  /**
   * Create new reservation
   */
  @ApiOperation({
    summary: 'Create new reservation - ADMIN or owner user access.',
    description: `
    Rules:
    1 - Start day can not be in the past.\n
    2 - End day must be after start day.\n
    3 - Reservation must be at least one day.\n
    4 - Reservation must be maximum thirty days.
    `,
  })
  @ApiResponse({ status: 400, description: 'Start day can not be in the past.' })
  @ApiResponse({ status: 400, description: 'End day must be after start day.' })
  @ApiResponse({ status: 400, description: 'Reservation must be at least one day.' })
  @ApiResponse({ status: 400, description: 'Reservation must be maximum thirty days.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'FORBIDDEN - Only user it self or ADMIN are authorized.' })
  @ApiResponse({ status: 404, description: 'The book was not found' })
  @ApiResponse({ status: 404, description: 'The user was not found' })
  @ApiResponse({ status: 409, description: 'The book is not available for the selected dates' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBearerAuth()
  @UseGuards(SelfOrAdminGuard)
  @Post('userId/:userId')
  create(@Param('userId') userId: string, @Body() newReservation: CreateReservationDto): Promise<ReservationDto> {
    return this.reservationsService.create(userId, newReservation);
  }

  /**
   * Get reservation by reservationId 
  */
  @ApiOperation({
    summary: 'Get reservation by reservationId - ADMIN Access ',
    description: `Get reservation by reservationId
    `,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'The reservation with id  does not exist' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBearerAuth()
  @HasRoles('ADMIN')
  @Get(':reservationId')
  findOne(@Param('reservationId') id: string) {
    return this.reservationsService.findReservationById(id);
  }

  /**
   * Get all reservations
  */
  @ApiOperation({
    summary: 'Get all reservations - ADMIN Access ',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'There are no reservations in the Database' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBearerAuth()
  @HasRoles('ADMIN')
  @Get()
  findAll(@Req() request: Request): Promise<Reservation[]> {

    return this.reservationsService.findAll(request.query);
  }

  /**
   * Get a reservation by userId
   */
  @ApiOperation({
    summary: 'Get a reservation by userId - ADMIN or user owner access',
    description: `Only ADMIN or User it self.`,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 403, description: 'FORBIDDEN - Only user it self or ADMIN are authorized.' })
  @ApiResponse({ status: 404, description: 'User does not haver reservations' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBearerAuth()
  @UseGuards(SelfOrAdminGuard)
  @Get('/userId/:userId')
  findByUserId(@Param('userId') userId: string): Promise<ReservationDto[]> {
    return this.reservationsService.findReservationByUserId(userId);
  }

  /**
   * Get reservations by bookID
   */
  @ApiOperation({
    summary: 'Get reservations by bookID - ADMIN or User access',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'FORBIDDEN - Only user it self or ADMIN are authorized.' })
  @ApiResponse({ status: 404, description: 'Book does not haver reservations' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBearerAuth()
  @HasRoles('ADMIN', 'USER')
  @Get('/bookId/:bookId')
  findByBookId(@Param('bookId') bookId: string): Promise<ReservationDto[]> {
    return this.reservationsService.findReservationByBookId(bookId);
  }

  /**
   * Get reservations by bookID
   */
  @ApiOperation({
    summary: 'Get reservations by bookID - Public Access',
  })
  @ApiResponse({ status: 404, description: 'Book does not haver reservations' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBearerAuth()
  @Public()
  @Get('/public/bookId/:bookId')
  publicFindByBookId(@Param('bookId') bookId: string): Promise<PublicReservationDto[]> {
    return this.reservationsService.findReservationByBookIdPublic(bookId);
  }


  /**
   * Update reservation
   */
  @ApiOperation({
    summary: 'Update reservation - ADMIN or user owner access.',
    description: `Only ADMIN or User it self can update a reservation.`,
  })
  @ApiResponse({ status: 200, description: 'The reservation was updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 403, description: 'FORBIDDEN - Only user it self or ADMIN are authorized.' })
  @ApiResponse({ status: 404, description: 'The reservation with id 16 does not exist.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBearerAuth()
  @UseGuards(SelfOrAdminGuard)
  @Put('userId/:userId/reservationId/:reservationId')
  update(
    @Param('userId') userId: string,
    @Param('reservationId') reservationId: string,
    @Body() updateReservationDto: UpdateReservationDto)
    : Promise<any> {
    return this.reservationsService.update(userId, reservationId, updateReservationDto);
  }

  /**
   * Delete Reservation
   */
  @ApiOperation({
    summary: 'Delete Reservation - ADMIN or user owner access.',
    description: `Only ADMIN or User it self can delete a reservation.`,
  })
  @ApiResponse({ status: 200, description: 'The reservation was deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 403, description: 'FORBIDDEN - Only user it self or ADMIN are authorized.' })
  @ApiResponse({ status: 404, description: 'The reservation with id 16 does not exist.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBearerAuth()
  @UseGuards(SelfOrAdminGuard)
  @Delete('userId/:userId/reservationId/:reservationId')
  deleteReservation(
    @Param('userId') userId: string,
    @Param('reservationId') reservationId: string,
  ): Promise<any> {
    return this.reservationsService.deleteReservation(userId,reservationId);
  }
}