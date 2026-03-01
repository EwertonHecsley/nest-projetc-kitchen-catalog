import { ProductGateway } from 'src/domain/product/ports/ProductGateway';
import CreateProductFactory, {
  CreateProductRequest,
} from './factory/CreateProductFactory';
import { Either, left, right } from 'src/shared/either';
import Product from 'src/domain/product/entity/Product';
import { DomainErrorException } from 'src/shared/errors/exceptions/DomainErrorException';
import { GatewayError } from 'src/shared/errors/exceptions/GatewayErrorException';
import { RequestGatewayError } from 'src/shared/errors/exceptions/RequestGatewayError';

type Request = CreateProductRequest;
type CreateProductError = DomainErrorException | GatewayError;

export default class CreateProductUseCase {
  constructor(private readonly productGateway: ProductGateway) {}

  private validate(request: Request): Either<CreateProductError, Product> {
    return CreateProductFactory.validate(request);
  }

  async execute(
    request: Request,
  ): Promise<Either<CreateProductError, Product>> {
    const validationResult = this.validate(request);
    if (validationResult.isLeft()) {
      return validationResult;
    }

    const productOrError = validationResult.value;
    try {
      const createdProduct = await this.productGateway.create(productOrError);
      return right(createdProduct);
    } catch (error) {
      return left(new RequestGatewayError('Failed to create product'));
    }
  }
}
