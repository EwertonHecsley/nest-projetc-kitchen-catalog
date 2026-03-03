import Product from 'src/domain/product/entity/Product';
import Identity from 'src/core/generics/Identity';
import { InvalidCategoryException } from 'src/shared/errors/exceptions/InvalidCategoryException';
import { InvalidNameException } from 'src/shared/errors/exceptions/InvalidNameException';
import { InvalidPhotoUrlException } from 'src/shared/errors/exceptions/InvalidPhotoUrlException';
import { InvalidPriceException } from 'src/shared/errors/exceptions/InvalidPriceException';

describe('Product', () => {
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

  it('creates a product with the provided attributes', () => {
    const product = makeProduct();

    expect(product.identity.id).toBe('product-id');
    expect(product.name).toBe('Burger');
    expect(product.price).toBe(25);
    expect(product.category).toBe('PRATOS_PRINCIPAIS');
    expect(product.photo).toBe('https://example.com/burger.png');
    expect(product.isVisible).toBe(true);
  });

  it('changes the name when valid', () => {
    const product = makeProduct();

    const result = product.changeName('  Updated Burger  ');

    expect(result.isRight()).toBe(true);
    expect(product.name).toBe('Updated Burger');
  });

  it('returns invalid name when changing to an empty value', () => {
    const product = makeProduct();

    const result = product.changeName('   ');

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidNameException);
  });

  it('changes the price when valid', () => {
    const product = makeProduct();

    const result = product.changePrice(0);

    expect(result.isRight()).toBe(true);
    expect(product.price).toBe(0);
  });

  it('returns invalid price for negative values', () => {
    const product = makeProduct();

    const result = product.changePrice(-1);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidPriceException);
  });

  it('changes the category when valid', () => {
    const product = makeProduct();

    const result = product.changeCategory('BEBIDAS');

    expect(result.isRight()).toBe(true);
    expect(product.category).toBe('BEBIDAS');
  });

  it('returns invalid category when category is empty', () => {
    const product = makeProduct();

    const result = product.changeCategory('' as never);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCategoryException);
  });

  it('changes the photo to null', () => {
    const product = makeProduct();

    const result = product.changePhoto(null);

    expect(result.isRight()).toBe(true);
    expect(product.photo).toBeNull();
  });

  it('returns invalid photo url for malformed urls', () => {
    const product = makeProduct();

    const result = product.changePhoto('not-an-url');

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidPhotoUrlException);
  });

  it('changes visibility with hide and show helpers', () => {
    const product = makeProduct();

    product.hide();
    expect(product.isVisible).toBe(false);

    product.show();
    expect(product.isVisible).toBe(true);
  });
});
