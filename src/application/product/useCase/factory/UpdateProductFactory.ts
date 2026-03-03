import Product, { ProductCategory } from 'src/domain/product/entity/Product';
import { Either, left, right } from 'src/shared/either';
import { InvalidCategoryException } from 'src/shared/errors/exceptions/InvalidCategoryException';
import { InvalidNameException } from 'src/shared/errors/exceptions/InvalidNameException';
import { InvalidPhotoUrlException } from 'src/shared/errors/exceptions/InvalidPhotoUrlException';
import { InvalidPriceException } from 'src/shared/errors/exceptions/InvalidPriceException';
import { PRODUCT_CATEGORIES } from './CreateProductFactory';

export type UpdateProductRequest = {
  name?: string;
  price?: number;
  category?: ProductCategory;
  photo?: string | null;
  isVisible?: boolean;
};

type UpdateProductErrors =
  | InvalidNameException
  | InvalidPriceException
  | InvalidCategoryException
  | InvalidPhotoUrlException;

export default class UpdateProductFactory {
  static validateAndApply(
    product: Product,
    data: UpdateProductRequest,
  ): Either<UpdateProductErrors, Product> {
    const hasAnyField =
      data.name !== undefined ||
      data.price !== undefined ||
      data.category !== undefined ||
      data.photo !== undefined ||
      data.isVisible !== undefined;

    if (!hasAnyField) {
      return right(product);
    }

    if (data.name !== undefined) {
      const name = data.name.trim();
      const r = product.changeName(name);
      if (r.isLeft()) return left(r.value);
    }

    if (data.price !== undefined) {
      const price = data.price;

      if (!Number.isFinite(price) || price < 0) {
        return left(new InvalidPriceException());
      }

      const r = product.changePrice(price);
      if (r.isLeft()) return left(r.value);
    }

    if (data.category !== undefined) {
      const category = data.category;

      if (!PRODUCT_CATEGORIES.includes(category)) {
        return left(new InvalidCategoryException());
      }

      const r = product.changeCategory(category);
      if (r.isLeft()) return left(r.value);
    }

    if (data.photo !== undefined) {
      if (data.photo === null) {
        const r = product.changePhoto(null);
        if (r.isLeft()) return left(r.value);
      } else {
        const photo = data.photo.trim();

        if (!photo) {
          return left(new InvalidPhotoUrlException());
        }

        try {
          new URL(photo);
        } catch {
          return left(new InvalidPhotoUrlException());
        }

        const r = product.changePhoto(photo);
        if (r.isLeft()) return left(r.value);
      }
    }

    if (data.isVisible !== undefined) {
      product.changeVisibility(data.isVisible);
    }

    return right(product);
  }
}
