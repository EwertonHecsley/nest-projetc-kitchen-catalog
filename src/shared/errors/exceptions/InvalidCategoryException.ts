import { DomainErrorException } from './DomainErrorException';

export class InvalidCategoryException extends DomainErrorException {
  constructor(message = 'Invalid category') {
    super(message, 'INVALID_CATEGORY');
  }
}
