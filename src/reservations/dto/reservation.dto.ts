import { IsString, IsDateString, IsNotEmpty } from 'class-validator';

export class ReservationDto {

    @IsString()
    @IsNotEmpty()
    bookId: number;

    @IsString()
    @IsNotEmpty()
    userId: number;

    @IsDateString()
    @IsNotEmpty()
    startDate: Date;

    @IsDateString()
    @IsNotEmpty()
    endDate: Date;
}
