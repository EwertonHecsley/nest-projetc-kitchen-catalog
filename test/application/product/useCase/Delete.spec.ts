import { ProductNotFoundError } from 'src/application/product/errors/ProductNotFoundError';
import DeleteProductUseCase from 'src/application/product/useCase/Delete';
import Identity from 'src/core/generics/Identity';
import Product from 'src/domain/product/entity/Product';
import { ProductGateway } from 'src/domain/product/ports/ProductGateway';
import { RequestGatewayError } from 'src/shared/errors/exceptions/RequestGatewayError';

describe('DeleteProductUseCase', () => {
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

  it('deletes the product when it exists', async () => {
    const gateway = makeGateway();
    gateway.find.mockResolvedValue(makeProduct());
    gateway.destroy.mockResolvedValue(undefined);
    const useCase = new DeleteProductUseCase(gateway);

    const result = await useCase.execute({ id: 'product-id' });

    expect(result.isRight()).toBe(true);
    expect(gateway.find).toHaveBeenCalledWith('product-id');
    expect(gateway.destroy).toHaveBeenCalledWith('product-id');
  });

  it('returns not found when product does not exist', async () => {
    const gateway = makeGateway();
    gateway.find.mockResolvedValue(null);
    const useCase = new DeleteProductUseCase(gateway);

    const result = await useCase.execute({ id: 'missing-id' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ProductNotFoundError);
    expect(gateway.destroy).not.toHaveBeenCalled();
  });

  it('returns gateway error when find fails', async () => {
    const gateway = makeGateway();
    gateway.find.mockRejectedValue(new Error('db down'));
    const useCase = new DeleteProductUseCase(gateway);

    const result = await useCase.execute({ id: 'product-id' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RequestGatewayError);
    expect(gateway.destroy).not.toHaveBeenCalled();
  });

  it('returns gateway error when destroy fails', async () => {
    const gateway = makeGateway();
    gateway.find.mockResolvedValue(makeProduct());
    gateway.destroy.mockRejectedValue(new Error('db down'));
    const useCase = new DeleteProductUseCase(gateway);

    const result = await useCase.execute({ id: 'product-id' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RequestGatewayError);
  });
});
