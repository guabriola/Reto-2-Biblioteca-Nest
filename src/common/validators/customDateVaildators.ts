import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  import { isAfter, isBefore, addDays, isToday, parseISO } from 'date-fns';
  
  @ValidatorConstraint({ name: 'customDateRange', async: false })
  export class CustomDateRangeValidator implements ValidatorConstraintInterface {
    private errors: string[] = [];

    validate(value: any, args: ValidationArguments) {
      const { startDate, endDate } = args.object as any;
      
      const start = parseISO(startDate);
      const end = parseISO(endDate);
  
      if (!isToday(start) && isBefore(start, new Date())) {
        this.errors.push("Start day can not be in the past.");
      }
  
      if (isBefore(end, start)) {
        this.errors.push("End day must be after start day.");
      }
  
      const maxEndDate = addDays(start, 30);
      const minEndDate = addDays(start, 1);

      if(isBefore(end,minEndDate)){
        this.errors.push("Reservation must be at least one day.");
      }
      if (isAfter(end, maxEndDate)) {
        this.errors.push("Reservation must be maximum thirty days.");
      }
      console.log(this.errors.length);
      if(this.errors.length === 0){
        return true
      }else return false
    }
    
    defaultMessage(args: ValidationArguments) {
      return this.errors.join(' ');
    }
  }