import { IsString, IsDateString, IsNotEmpty, Validate} from 'class-validator';
import { CustomDateRangeValidator } from 'src/common/validators/customDateVaildators';

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

    @Validate(CustomDateRangeValidator)
    validateDates() {
      return this;
    }

}