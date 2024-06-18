import { IsString, IsDateString } from 'class-validator';

export class ReservationDto {

    
    readonly bookId: string;
    readonly userId: string;
    @IsDateString()
    readonly startDate: String;
    @IsDateString()  
    readonly endDate: String;
}
