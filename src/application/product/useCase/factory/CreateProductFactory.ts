import Product, { ProductCategory } from 'src/domain/product/entity/Product';
import { Either, left, right } from 'src/shared/either';
import { InvalidCategoryException } from 'src/shared/errors/exceptions/InvalidCategoryException';
import { InvalidNameException } from 'src/shared/errors/exceptions/InvalidNameException';
import { InvalidPhotoUrlException } from 'src/shared/errors/exceptions/InvalidPhotoUrlException';
import { InvalidPriceException } from 'src/shared/errors/exceptions/InvalidPriceException';

export type CreateProductRequest = {
  name: string;
  price: number;
  category: ProductCategory;
  photo?: string;
  isVisible?: boolean;
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'ENTRADAS',
  'PRATOS_PRINCIPAIS',
  'SOBREMESAS',
  'BEBIDAS',
];

export default class CreateProductFactory {
  static validate(
    data: CreateProductRequest,
  ): Either<
    | InvalidNameException
    | InvalidPriceException
    | InvalidCategoryException
    | InvalidPhotoUrlException,
    Product
  > {
    const name = data.name?.trim();
    const photo = data.photo?.trim() ?? null;

    if (!name) return left(new InvalidNameException());

    if (!Number.isFinite(data.price) || data.price <= 0) {
      return left(new InvalidPriceException());
    }

    if (!PRODUCT_CATEGORIES.includes(data.category)) {
      return left(new InvalidCategoryException());
    }

    if (photo) {
      try {
        new URL(photo);
      } catch {
        return left(new InvalidPhotoUrlException());
      }
    }

    const product = Product.create({
      name,
      price: data.price,
      category: data.category,
      photo: photo ?? null,
      isVisible: data.isVisible ?? true,
      createdAt: new Date(),
    });

    return right(product);
  }
}
