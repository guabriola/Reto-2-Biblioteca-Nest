import { IsString, IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Reservation } from '../entities/reservation.entity';

export class ReservationDto {

    @IsString()
    @IsNotEmpty()
    readonly id: number;

    @IsString()
    @IsNotEmpty()
    readonly bookId: number;

    @IsString()
    @IsNotEmpty()
    readonly userId: number;

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

    //Constructor implementation, if has a parameter with type Reservation us this
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
