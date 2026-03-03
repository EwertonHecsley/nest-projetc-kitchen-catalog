import { ProductNotFoundError } from '../errors/ProductNotFoundError';
import { ProductGateway } from 'src/domain/product/ports/ProductGateway';
import { Either, left, right } from 'src/shared/either';
import { GatewayError } from 'src/shared/errors/exceptions/GatewayErrorException';
import { RequestGatewayError } from 'src/shared/errors/exceptions/RequestGatewayError';

type DeleteRequest = {
  id: string;
};

type DeleteProductError = GatewayError | ProductNotFoundError;

export default class DeleteProductUseCase {
  constructor(private readonly productGateway: ProductGateway) {}

  async execute(
    request: DeleteRequest,
  ): Promise<Either<DeleteProductError, void>> {
    const { id } = request;

    try {
      const existingProduct = await this.productGateway.find(id);

      if (!existingProduct) {
        return left(new ProductNotFoundError());
      }

      await this.productGateway.destroy(id);
      return right(undefined);
    } catch (error) {
      return left(new RequestGatewayError('Failed to delete product'));
    }
  }
}
