import UpdateProductFactory from 'src/application/product/useCase/factory/UpdateProductFactory';
import Product from 'src/domain/product/entity/Product';
import Identity from 'src/core/generics/Identity';
import { InvalidCategoryException } from 'src/shared/errors/exceptions/InvalidCategoryException';
import { InvalidNameException } from 'src/shared/errors/exceptions/InvalidNameException';
import { InvalidPhotoUrlException } from 'src/shared/errors/exceptions/InvalidPhotoUrlException';
import { InvalidPriceException } from 'src/shared/errors/exceptions/InvalidPriceException';

describe('UpdateProductFactory', () => {
  const makeProduct = () =>
    Product.create(
      {
        name: 'Burger',
        price: 25,
        category: 'PRATOS_PRINCIPAIS',
        photo: 'https://example.com/burger.png',
        isVisible: true,
        createdAt: new Date('2026-03-03T00:00:00.000Z'),
      },
      new Identity('product-id'),
    );

  it('applies valid updates to the existing product', () => {
    const product = makeProduct();

    const result = UpdateProductFactory.validateAndApply(product, {
      name: '  Soda  ',
      price: 12,
      category: 'BEBIDAS',
      photo: 'https://example.com/soda.png',
      isVisible: false,
    });

    expect(result.isRight()).toBe(true);
    expect(product.name).toBe('Soda');
    expect(product.price).toBe(12);
    expect(product.category).toBe('BEBIDAS');
    expect(product.photo).toBe('https://example.com/soda.png');
    expect(product.isVisible).toBe(false);
  });

  it('returns the product unchanged when no fields are provided', () => {
    const product = makeProduct();

    const result = UpdateProductFactory.validateAndApply(product, {});

    expect(result.isRight()).toBe(true);
    if (result.isLeft()) {
      throw new Error('Expected unchanged product');
    }

    expect(result.value).toBe(product);
  });

  it('returns invalid name when name is blank', () => {
    const product = makeProduct();

    const result = UpdateProductFactory.validateAndApply(product, {
      name: '   ',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidNameException);
  });

  it('returns invalid price when price is negative', () => {
    const product = makeProduct();

    const result = UpdateProductFactory.validateAndApply(product, {
      price: -1,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidPriceException);
  });

  it('returns invalid category when category is outside the allowed list', () => {
    const product = makeProduct();

    const result = UpdateProductFactory.validateAndApply(product, {
      category: 'INVALID' as never,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCategoryException);
  });

  it('returns invalid photo url when photo is blank', () => {
    const product = makeProduct();

    const result = UpdateProductFactory.validateAndApply(product, {
      photo: '   ',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidPhotoUrlException);
  });

  it('allows removing the photo by setting null', () => {
    const product = makeProduct();

    const result = UpdateProductFactory.validateAndApply(product, {
      photo: null,
    });

    expect(result.isRight()).toBe(true);
    expect(product.photo).toBeNull();
  });
});
