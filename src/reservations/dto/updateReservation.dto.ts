import { IsDateString, IsOptional, Validate } from 'class-validator';
import { CustomDateRangeValidator } from 'src/common/validators/customDateVaildators';

export class UpdateReservationDto {

    /**
    * Booking start day
    * Date format --> YY/MM/DD
    * @example 2024-06-01
    */
    @IsDateString()
    @IsOptional()
    readonly startDate: Date;

    /**
    * Booking end day
    * Date format --> YY/MM/DD
    * @example 2024-06-01
    */
    @IsDateString()
    @IsOptional()
    readonly endDate: Date;

    // @Validate(CustomDateRangeValidator)
    // validateDates() {
    //   return this;
    // }
}
