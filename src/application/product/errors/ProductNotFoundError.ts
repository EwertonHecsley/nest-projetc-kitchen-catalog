import { AppError } from './AppError';

export class ProductNotFoundError extends AppError {
  constructor() {
    super('Product not found', 'PRODUCT_NOT_FOUND');
  }
}
