import { ProductNotFoundError } from 'src/application/product/errors/ProductNotFoundError';
import { ProductGateway } from 'src/domain/product/ports/ProductGateway';
import { Either, left, right } from 'src/shared/either';
import { DomainErrorException } from 'src/shared/errors/exceptions/DomainErrorException';
import { GatewayError } from 'src/shared/errors/exceptions/GatewayErrorException';
import { RequestGatewayError } from 'src/shared/errors/exceptions/RequestGatewayError';
import UpdateProductFactory, {
  UpdateProductRequest,
} from './factory/UpdateProductFactory';
import Product from 'src/domain/product/entity/Product';

export type UpdateProductUseCaseRequest = {
  id: string;
} & UpdateProductRequest;

type UpdateProductError =
  | DomainErrorException
  | ProductNotFoundError
  | GatewayError;

export default class UpdateProductUseCase {
  constructor(private readonly productGateway: ProductGateway) {}

  private validate(
    product: Product,
    request: UpdateProductRequest,
  ): Either<DomainErrorException, Product> {
    return UpdateProductFactory.validateAndApply(product, request);
  }

  async execute(
    request: UpdateProductUseCaseRequest,
  ): Promise<Either<UpdateProductError, Product>> {
    try {
      const existingProduct = await this.productGateway.find(request.id);

      if (!existingProduct) {
        return left(new ProductNotFoundError());
      }

      const validationResult = this.validate(existingProduct, request);
      if (validationResult.isLeft()) {
        return validationResult;
      }

      const updatedProduct = validationResult.value;
      await this.productGateway.save(updatedProduct);

      return right(updatedProduct);
    } catch (error) {
      return left(new RequestGatewayError('Failed to update product'));
    }
  }
}
