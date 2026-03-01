import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

export class HttpErrorMapper {
  static toHttp(error: Error) {
    switch (error.constructor.name) {

      // DOMAIN
      case 'InvalidPriceException':
      case 'InvalidNameException':
        return new BadRequestException({
          code: (error as any).code,
          message: error.message,
        });

      // APPLICATION
      case 'ProductNotFoundError':
        return new NotFoundException({
          code: (error as any).code,
          message: error.message,
        });

      default:
        return new InternalServerErrorException({
          code: 'INTERNAL_ERROR',
          message: error.message,
        });
    }
  }
}