import { BadRequestException } from '@nestjs/common';

export class badRequestExceptions extends BadRequestException {
  constructor(public readonly validationErrors: string[]) {
    super();
  }

  getErrors() {
    return this.validationErrors;
  }
}