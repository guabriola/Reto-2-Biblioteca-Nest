import { IsString, IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Reservation } from '../entities/reservation.entity';

export class ReservationDto {

    /**
     * Id of the book of the booking
     */
    @IsString()
    @IsNotEmpty()
    readonly id: number;

    /**
     * Id of the user of the booking
     */
    @IsString()
    @IsNotEmpty()
    readonly bookId: number;

    /**
    * Booking start day
    * Date format --> YY/MM/DD
    * @example 2024-06-01
    */
    @IsString()
    @IsNotEmpty()
    readonly userId: number;

    /**
    * Booking end day
    * Date format --> YY/MM/DD
    * @example 2024-06-01
    */
    @IsDateString()
    @IsNotEmpty()
    readonly startDate: Date;

    @IsDateString()
    @IsNotEmpty()
    readonly endDate: Date;

    //Constructor declaration
    constructor();

    //Constructor declaration
    constructor(reservation: Reservation);

    //Constructor implementation, if has a parameter with type Reservation us this one
    //If is not, uses empty constructor.
    //This is used to change From Reservation Type yo ReservationDTO type (It's a Mapping)
    constructor(reservation?: Reservation) {
        if (reservation) {
            this.id = reservation.id
            this.bookId = reservation.book.id;
            this.userId = reservation.user.id;
            this.startDate = reservation.startDate;
            this.endDate = reservation.endDate;
        }
    }
}
