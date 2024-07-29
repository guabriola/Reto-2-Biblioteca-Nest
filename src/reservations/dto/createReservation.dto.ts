import { IsString, IsDateString, IsNotEmpty, Validate} from 'class-validator';
import { CustomDateRangeValidator } from 'src/common/validators/customDateVaildators';

export class CreateReservationDto {

    /**
     * Id of the book of the booking
     */
    @IsString()
    @IsNotEmpty()
    readonly bookId: number;

    /**
     * Id of the user of the booking
     */
    @IsString()
    @IsNotEmpty()
    readonly userId: number;

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

    @Validate(CustomDateRangeValidator)
    validateDates() {
      return this;
    }

}