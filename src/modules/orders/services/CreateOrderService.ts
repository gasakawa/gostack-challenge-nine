import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Product from '@modules/products/infra/typeorm/entities/Product';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found');
    }

    const productsSent = await this.productsRepository.findAllById(
      products.map(product => ({ id: product.id })),
    );

    if (productsSent.length !== products.length) {
      throw new AppError('Some products are invalid');
    }

    const productsToSave = productsSent.map(product => {
      const p = products.find(prod => prod.id === product.id);
      if (p) {
        if (product.quantity >= p.quantity) {
          return {
            product_id: product.id,
            quantity: p.quantity,
            price: product.price,
          };
        }
        return {
          product_id: product.id,
          quantity: -1,
          price: product.price,
        };
      }
      return {
        product_id: product.id,
        quantity: -1,
        price: product.price,
      };
    });

    const checkQuantity = productsToSave.filter(
      product => product.quantity < 0,
    );

    if (checkQuantity.length > 0) {
      throw new AppError('Quantity less');
    }

    const order = await this.ordersRepository.create({
      customer,
      products: productsToSave,
    });

    await this.productsRepository.updateQuantity(products);

    // delete order.created_at;
    // delete order.updated_at;
    // delete order.customer_id;

    return order;
  }
}

export default CreateOrderService;
