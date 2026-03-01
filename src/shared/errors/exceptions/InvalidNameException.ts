import { DomainErrorException } from './DomainErrorException';

export class InvalidNameException extends DomainErrorException {
  constructor(message = 'Invalid name') {
    super(message, 'INVALID_NAME');
  }
}
