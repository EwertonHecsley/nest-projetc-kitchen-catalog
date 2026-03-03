import CreateProductUseCase from 'src/application/product/useCase/Create';
import Product from 'src/domain/product/entity/Product';
import { ProductGateway } from 'src/domain/product/ports/ProductGateway';
import { InvalidNameException } from 'src/shared/errors/exceptions/InvalidNameException';
import { RequestGatewayError } from 'src/shared/errors/exceptions/RequestGatewayError';

describe('CreateProductUseCase', () => {
  const makeCreatedProduct = () =>
    Product.create({
      name: 'Burger',
      price: 20,
      category: 'PRATOS_PRINCIPAIS',
      photo: 'https://example.com/burger.png',
      isVisible: true,
      createdAt: new Date('2026-03-03T00:00:00.000Z'),
    });

  const makeGateway = (): jest.Mocked<ProductGateway> =>
    ({
      create: jest.fn(),
      find: jest.fn(),
      destroy: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
    }) as jest.Mocked<ProductGateway>;

  it('creates a product through the gateway when request is valid', async () => {
    const gateway = makeGateway();
    const createdProduct = makeCreatedProduct();
    gateway.create.mockResolvedValue(createdProduct);
    const useCase = new CreateProductUseCase(gateway);

    const result = await useCase.execute({
      name: 'Burger',
      price: 20,
      category: 'PRATOS_PRINCIPAIS',
      photo: 'https://example.com/burger.png',
      isVisible: true,
    });

    expect(result.isRight()).toBe(true);
    expect(gateway.create).toHaveBeenCalledTimes(1);
    expect(gateway.create).toHaveBeenCalledWith(expect.any(Product));
    if (result.isLeft()) {
      throw new Error('Expected created product');
    }

    expect(result.value).toBe(createdProduct);
  });

  it('returns validation error before calling the gateway', async () => {
    const gateway = makeGateway();
    const useCase = new CreateProductUseCase(gateway);

    const result = await useCase.execute({
      name: '   ',
      price: 20,
      category: 'PRATOS_PRINCIPAIS',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidNameException);
    expect(gateway.create).not.toHaveBeenCalled();
  });

  it('returns gateway error when gateway create fails', async () => {
    const gateway = makeGateway();
    gateway.create.mockRejectedValue(new Error('db down'));
    const useCase = new CreateProductUseCase(gateway);

    const result = await useCase.execute({
      name: 'Burger',
      price: 20,
      category: 'PRATOS_PRINCIPAIS',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RequestGatewayError);
  });
});
