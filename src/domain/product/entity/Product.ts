import Entity from 'src/core/generics/Entity';
import Identity from 'src/core/generics/Identity';
import { Either, left, right } from 'src/shared/either';
import { InvalidNameException } from 'src/shared/errors/exceptions/InvalidNameException';
import { InvalidPriceException } from 'src/shared/errors/exceptions/InvalidPriceException';
import { InvalidCategoryException } from 'src/shared/errors/exceptions/InvalidCategoryException';
import { InvalidPhotoUrlException } from 'src/shared/errors/exceptions/InvalidPhotoUrlException';

export type ProductCategory =
  | 'ENTRADAS'
  | 'PRATOS_PRINCIPAIS'
  | 'SOBREMESAS'
  | 'BEBIDAS';

type ProductAttributes = {
  name: string;
  price: number;
  category: ProductCategory;
  photo: string | null;
  isVisible: boolean;
  createdAt: Date;
};

export default class Product extends Entity<ProductAttributes> {
  private constructor(attributes: ProductAttributes, id?: Identity) {
    super(attributes, id);
  }

  static create(attributes: ProductAttributes, id?: Identity): Product {
    return new Product(
      {
        ...attributes,
        photo: attributes.photo ?? null,
        isVisible: attributes.isVisible ?? true,
        createdAt: attributes.createdAt ?? new Date(),
      },
      id,
    );
  }

  get name(): string {
    return this.attributes.name;
  }

  get price(): number {
    return this.attributes.price;
  }

  get category(): ProductCategory {
    return this.attributes.category;
  }

  get photo(): string | null {
    return this.attributes.photo;
  }

  get isVisible(): boolean {
    return this.attributes.isVisible;
  }

  get createdAt(): Date {
    return this.attributes.createdAt!;
  }

  changeName(newName: string): Either<InvalidNameException, Product> {
    if (!newName || newName.trim().length === 0) {
      return left(new InvalidNameException('Product name cannot be empty'));
    }

    this.attributes.name = newName.trim();
    return right(this);
  }

  changePrice(newPrice: number): Either<InvalidPriceException, Product> {
    if (Number.isNaN(newPrice) || !Number.isFinite(newPrice)) {
      return left(
        new InvalidPriceException('Product price must be a valid number'),
      );
    }

    if (newPrice < 0) {
      return left(
        new InvalidPriceException('Product price cannot be negative'),
      );
    }

    this.attributes.price = newPrice;
    return right(this);
  }

  changeCategory(
    newCategory: ProductCategory,
  ): Either<InvalidCategoryException, Product> {
    if (!newCategory) {
      return left(new InvalidCategoryException('Product category is required'));
    }

    this.attributes.category = newCategory;
    return right(this);
  }

  changePhoto(
    newPhoto: string | null,
  ): Either<InvalidPhotoUrlException, Product> {
    if (newPhoto === null) {
      this.attributes.photo = null;
      return right(this);
    }

    const url = newPhoto?.trim();
    if (!url) {
      return left(
        new InvalidPhotoUrlException('Product photo url cannot be empty'),
      );
    }

    try {
      new URL(url);
    } catch {
      return left(
        new InvalidPhotoUrlException('Product photo url must be a valid URL'),
      );
    }

    this.attributes.photo = url;
    return right(this);
  }

  hide(): Product {
    this.attributes.isVisible = false;
    return this;
  }

  show(): Product {
    this.attributes.isVisible = true;
    return this;
  }

  changeVisibility(value: boolean): Product {
    this.attributes.isVisible = value;
    return this;
  }
}
