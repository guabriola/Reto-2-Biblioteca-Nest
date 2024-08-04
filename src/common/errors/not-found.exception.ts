import { HttpException, HttpStatus } from '@nestjs/common';

//Customized error for notFoundElements
export default class NotFoundError extends HttpException {
  constructor(resource: string, identifier: string) {
    super({
    // Commented because this data it already in all-exeprion.filter
    //   title: 'Not Found',
    //   status: HttpStatus.NOT_FOUND,
      detail: 'The resource you requested could not be found.',
      errors: [{
        message: `${resource} with identifier '${identifier}' was not found`
      }]
    }, HttpStatus.NOT_FOUND);
  }
}