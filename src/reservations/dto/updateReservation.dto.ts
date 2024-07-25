import { IsString, IsDateString, IsOptional, Validate } from 'class-validator';
import { CustomDateRangeValidator } from 'src/common/validators/customDateVaildators';

export class UpdateReservationDto {

    @IsString()
    @IsOptional()
    readonly bookId: number;

    @IsString()
    @IsOptional()
    readonly userId: number;

    @IsDateString()
    @IsOptional()
    readonly startDate: Date;

    @IsDateString()
    @IsOptional()
    readonly endDate: Date;

    @Validate(CustomDateRangeValidator)
    validateDates() {
      return this;
    }
}
