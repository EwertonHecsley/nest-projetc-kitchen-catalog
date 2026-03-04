import ListProductsUseCase from 'src/application/product/useCase/List';
import Identity from 'src/core/generics/Identity';
import Product from 'src/domain/product/entity/Product';
import {
  PaginatedResponse,
  ProductGateway,
} from 'src/domain/product/ports/ProductGateway';
import { RequestGatewayError } from 'src/shared/errors/exceptions/RequestGatewayError';

describe('ListProductsUseCase', () => {
  const makeGateway = (): jest.Mocked<ProductGateway> =>
    ({
      create: jest.fn(),
      find: jest.fn(),
      destroy: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
    }) as jest.Mocked<ProductGateway>;

  const makeProduct = () =>
    Product.create(
      {
        name: 'Burger',
        price: 20,
        category: 'PRATOS_PRINCIPAIS',
        photo: 'https://example.com/burger.png',
        isVisible: true,
        createdAt: new Date('2026-03-03T00:00:00.000Z'),
      },
      new Identity('product-id'),
    );

  it('returns the paginated list from the gateway', async () => {
    const gateway = makeGateway();
    const response: PaginatedResponse<Product> = {
      data: [makeProduct()],
      total: 1,
      page: 1,
      limit: 10,
    };
    gateway.findAll.mockResolvedValue(response);
    const useCase = new ListProductsUseCase(gateway);

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.isRight()).toBe(true);
    expect(gateway.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    if (result.isLeft()) {
      throw new Error('Expected paginated response');
    }

    expect(result.value).toEqual(response);
  });

  it('returns gateway error when listing fails', async () => {
    const gateway = makeGateway();
    gateway.findAll.mockRejectedValue(new Error('db down'));
    const useCase = new ListProductsUseCase(gateway);

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RequestGatewayError);
  });
});
