import Product from 'src/domain/product/entity/Product';
import {
  FindAllProducts,
  PaginatedResponse,
  ProductGateway,
} from 'src/domain/product/ports/ProductGateway';
import { Either, left, right } from 'src/shared/either';
import { GatewayError } from 'src/shared/errors/exceptions/GatewayErrorException';
import { RequestGatewayError } from 'src/shared/errors/exceptions/RequestGatewayError';

type ListProductsResponse = Either<GatewayError, PaginatedResponse<Product>>;

export default class ListProductsUseCase {
  constructor(private readonly productGateway: ProductGateway) {}

  async execute(params: FindAllProducts): Promise<ListProductsResponse> {
    try {
      const products = await this.productGateway.findAll(params);
      return right(products);
    } catch (error) {
      return left(new RequestGatewayError('Failed to list products'));
    }
  }
}
