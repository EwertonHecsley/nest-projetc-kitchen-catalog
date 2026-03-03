import CreateProductFactory from 'src/application/product/useCase/factory/CreateProductFactory';
import { InvalidCategoryException } from 'src/shared/errors/exceptions/InvalidCategoryException';
import { InvalidNameException } from 'src/shared/errors/exceptions/InvalidNameException';
import { InvalidPhotoUrlException } from 'src/shared/errors/exceptions/InvalidPhotoUrlException';
import { InvalidPriceException } from 'src/shared/errors/exceptions/InvalidPriceException';

describe('CreateProductFactory', () => {
  it('creates a product when request is valid', () => {
    const result = CreateProductFactory.validate({
      name: '  Burger  ',
      price: 20,
      category: 'PRATOS_PRINCIPAIS',
      photo: 'https://example.com/burger.png',
      isVisible: false,
    });

    expect(result.isRight()).toBe(true);
    if (result.isLeft()) {
      throw new Error('Expected a valid product');
    }

    expect(result.value.name).toBe('Burger');
    expect(result.value.price).toBe(20);
    expect(result.value.category).toBe('PRATOS_PRINCIPAIS');
    expect(result.value.photo).toBe('https://example.com/burger.png');
    expect(result.value.isVisible).toBe(false);
  });

  it('returns invalid name when name is blank', () => {
    const result = CreateProductFactory.validate({
      name: '   ',
      price: 20,
      category: 'PRATOS_PRINCIPAIS',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidNameException);
  });

  it('returns invalid price when price is zero', () => {
    const result = CreateProductFactory.validate({
      name: 'Burger',
      price: 0,
      category: 'PRATOS_PRINCIPAIS',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidPriceException);
  });

  it('returns invalid category when category is outside the allowed list', () => {
    const result = CreateProductFactory.validate({
      name: 'Burger',
      price: 20,
      category: 'INVALID' as never,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCategoryException);
  });

  it('returns invalid photo url when photo is malformed', () => {
    const result = CreateProductFactory.validate({
      name: 'Burger',
      price: 20,
      category: 'PRATOS_PRINCIPAIS',
      photo: 'invalid-url',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidPhotoUrlException);
  });
});
