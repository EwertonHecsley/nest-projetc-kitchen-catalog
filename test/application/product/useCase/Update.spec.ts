import { ProductNotFoundError } from 'src/application/product/errors/ProductNotFoundError';
import UpdateProductUseCase from 'src/application/product/useCase/Update';
import Product from 'src/domain/product/entity/Product';
import { ProductGateway } from 'src/domain/product/ports/ProductGateway';
import Identity from 'src/core/generics/Identity';
import { InvalidNameException } from 'src/shared/errors/exceptions/InvalidNameException';
import { RequestGatewayError } from 'src/shared/errors/exceptions/RequestGatewayError';

describe('UpdateProductUseCase', () => {
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

  it('updates and saves the product when request is valid', async () => {
    const gateway = makeGateway();
    const product = makeProduct();
    gateway.find.mockResolvedValue(product);
    gateway.save.mockResolvedValue(undefined);
    const useCase = new UpdateProductUseCase(gateway);

    const result = await useCase.execute({
      id: 'product-id',
      name: 'Updated Burger',
      price: 30,
      category: 'PRATOS_PRINCIPAIS',
      photo: 'https://example.com/updated-burger.png',
      isVisible: false,
    });

    expect(result.isRight()).toBe(true);
    expect(gateway.find).toHaveBeenCalledWith('product-id');
    expect(gateway.save).toHaveBeenCalledWith(product);
    expect(product.name).toBe('Updated Burger');
    expect(product.price).toBe(30);
    expect(product.photo).toBe('https://example.com/updated-burger.png');
    expect(product.isVisible).toBe(false);
  });

  it('returns not found when product does not exist', async () => {
    const gateway = makeGateway();
    gateway.find.mockResolvedValue(null);
    const useCase = new UpdateProductUseCase(gateway);

    const result = await useCase.execute({
      id: 'missing-id',
      name: 'Updated Burger',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ProductNotFoundError);
    expect(gateway.save).not.toHaveBeenCalled();
  });

  it('returns validation error before saving the product', async () => {
    const gateway = makeGateway();
    const product = makeProduct();
    gateway.find.mockResolvedValue(product);
    const useCase = new UpdateProductUseCase(gateway);

    const result = await useCase.execute({
      id: 'product-id',
      name: '   ',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidNameException);
    expect(gateway.save).not.toHaveBeenCalled();
  });

  it('returns gateway error when find fails', async () => {
    const gateway = makeGateway();
    gateway.find.mockRejectedValue(new Error('db down'));
    const useCase = new UpdateProductUseCase(gateway);

    const result = await useCase.execute({
      id: 'product-id',
      name: 'Updated Burger',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RequestGatewayError);
  });

  it('returns gateway error when save fails', async () => {
    const gateway = makeGateway();
    const product = makeProduct();
    gateway.find.mockResolvedValue(product);
    gateway.save.mockRejectedValue(new Error('db down'));
    const useCase = new UpdateProductUseCase(gateway);

    const result = await useCase.execute({
      id: 'product-id',
      name: 'Updated Burger',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RequestGatewayError);
  });
});
