import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });
    return this.ormRepository.save(product);
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return product;
  }

  public async findAllById(ids: IFindProducts[]): Promise<Product[]> {
    const products = await this.ormRepository.findByIds(ids);
    return products;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsUpdated = (await Promise.all(
      products.map(async product => {
        const p = await this.ormRepository.findOne(product.id);
        if (p) {
          p.quantity -= product.quantity;
          await this.ormRepository.save(p);
          return p;
        }
        return product;
      }),
    )) as Product[];
    return productsUpdated;
  }
}

export default ProductsRepository;
