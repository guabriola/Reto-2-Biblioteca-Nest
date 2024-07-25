import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  import { isAfter, isBefore, addDays, isToday, parseISO } from 'date-fns';
  
  @ValidatorConstraint({ name: 'customDateRange', async: false })
  export class CustomDateRangeValidator implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
      const { startDate, endDate } = args.object as any;
  
      const start = parseISO(startDate);
      const end = parseISO(endDate);
  
      if (!isToday(start) && isBefore(start, new Date())) {
        return false;
      }
  
      if (isBefore(end, start)) {
        return false;
      }
  
      const maxEndDate = addDays(start, 30);
      const minEndDate = addDays(start, 1);

      if(isBefore(end,minEndDate)){
        return false;
      }
      if (isAfter(end, maxEndDate)) {
        return false;
      }
  
      return true;
    }
  
    defaultMessage(args: ValidationArguments) {
      return 'Invalid date range!';
    }
  }