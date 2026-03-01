import Product from "../entity/Product";

export type FindAllProducts={
    page: number;
    limit: number;
}

export type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export abstract class ProductGateway {
    abstract create(product: Product): Promise<Product>;
    abstract find(id: string): Promise<Product | null>;
    abstract destroy(id: string): Promise<void>;
    abstract save(product: Product): Promise<void>;
    abstract findAll(params: FindAllProducts): Promise<PaginatedResponse<Product>>;
}