import { IsString, IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Reservation } from '../entities/reservation.entity';

export class PublicReservationDto {

    //Any one can che when a book its booked.
    //We hide userId and Id of boofor security purposes.
    //Book Id is not necessary.

    /**
    * Booking start day
    * Date format --> YY/MM/DD
    * @example 2024-06-01
    */
    @IsDateString()
    @IsNotEmpty()
    readonly startDate: Date;

    /**
    * Booking end day
    * Date format --> YY/MM/DD
    * @example 2024-06-01
    */
    @IsDateString()
    @IsNotEmpty()
    readonly endDate: Date;


    //Constructor declaration
    constructor();

    //Constructor declaration
    constructor(reservation: PublicReservationDto);

    //Constructor implementation
    constructor(reservation?: PublicReservationDto) {
        if (reservation) {
            this.startDate = reservation.startDate;
            this.endDate = reservation.endDate;
        }
    }
}