import { IsString, IsDateString, IsNotEmpty} from 'class-validator';

export class CreateReservationDto {

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

}