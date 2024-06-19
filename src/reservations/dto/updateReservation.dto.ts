import { IsString, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateReservationDto {

    @IsString()
    @IsOptional()
    readonly bookId: string;

    @IsString()
    @IsOptional()
    readonly userId: string;

    @IsDateString()
    @IsOptional()
    readonly startDate: String;

    @IsDateString()
    @IsOptional()
    readonly endDate: String;
}
