import { ProductNotFoundError } from 'src/application/product/errors/ProductNotFoundError';
import FindProductUseCase from 'src/application/product/useCase/Find';
import Identity from 'src/core/generics/Identity';
import Product from 'src/domain/product/entity/Product';
import { ProductGateway } from 'src/domain/product/ports/ProductGateway';
import { RequestGatewayError } from 'src/shared/errors/exceptions/RequestGatewayError';

describe('FindProductUseCase', () => {
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

  it('returns the product when it exists', async () => {
    const gateway = makeGateway();
    const product = makeProduct();
    gateway.find.mockResolvedValue(product);
    const useCase = new FindProductUseCase(gateway);

    const result = await useCase.execute({ id: 'product-id' });

    expect(result.isRight()).toBe(true);
    expect(gateway.find).toHaveBeenCalledWith('product-id');
    if (result.isLeft()) {
      throw new Error('Expected found product');
    }

    expect(result.value).toBe(product);
  });

  it('returns not found when product does not exist', async () => {
    const gateway = makeGateway();
    gateway.find.mockResolvedValue(null);
    const useCase = new FindProductUseCase(gateway);

    const result = await useCase.execute({ id: 'missing-id' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ProductNotFoundError);
  });

  it('returns gateway error when find fails', async () => {
    const gateway = makeGateway();
    gateway.find.mockRejectedValue(new Error('db down'));
    const useCase = new FindProductUseCase(gateway);

    const result = await useCase.execute({ id: 'product-id' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RequestGatewayError);
  });
});
