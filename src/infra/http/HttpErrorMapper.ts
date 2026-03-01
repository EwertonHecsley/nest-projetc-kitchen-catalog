import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductNotFoundError } from 'src/application/product/errors/ProductNotFoundError';
import { DomainErrorException } from 'src/shared/errors/exceptions/DomainErrorException';
import { GatewayError } from 'src/shared/errors/exceptions/GatewayErrorException';

export class HttpErrorMapper {
  static toHttp(error: Error) {
    // DOMAIN
    if (error instanceof DomainErrorException) {
      return new BadRequestException({
        code: (error as any).code,
        message: error.message,
      });
    }

    // APPLICATION
    if (error instanceof ProductNotFoundError) {
      return new NotFoundException({
        code: (error as any).code,
        message: error.message,
      });
    }

    // GATEWAY/INFRA
    if (error instanceof GatewayError) {
      return new InternalServerErrorException({
        code: (error as any).code,
        message: error.message,
      });
    }

    return new InternalServerErrorException({
      code: 'INTERNAL_ERROR',
      message: error.message,
    });
  }
}
