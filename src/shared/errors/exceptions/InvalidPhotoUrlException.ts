import { DomainErrorException } from './DomainErrorException';

export class InvalidPhotoUrlException extends DomainErrorException {
  constructor(message = 'Invalid photo url') {
    super(message, 'INVALID_PHOTO_URL');
  }
}
