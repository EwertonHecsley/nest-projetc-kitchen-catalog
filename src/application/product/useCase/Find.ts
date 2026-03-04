import { GatewayError } from 'src/shared/errors/exceptions/GatewayErrorException';
import { ProductNotFoundError } from '../errors/ProductNotFoundError';
import { ProductGateway } from 'src/domain/product/ports/ProductGateway';
import { Either, left, right } from 'src/shared/either';
import Product from 'src/domain/product/entity/Product';
import { RequestGatewayError } from 'src/shared/errors/exceptions/RequestGatewayError';

type FindProductRequest = {
  id: string;
};

type FindProductError = GatewayError | ProductNotFoundError;

export default class FindProductUseCase {
  constructor(private readonly productGateway: ProductGateway) {}

  async execute(
    request: FindProductRequest,
  ): Promise<Either<FindProductError, Product>> {
    const { id } = request;

    try {
      const product = await this.productGateway.find(id);
      if (!product) {
        return left(new ProductNotFoundError());
      }

      return right(product);
    } catch (error) {
      return left(new RequestGatewayError('Failed to find product'));
    }
  }
}
