import { DomainErrorException } from './DomainErrorException';

export class InvalidPriceException extends DomainErrorException {
  constructor(message = 'Invalid price') {
    super(message, 'INVALID_PRICE');
  }
}
