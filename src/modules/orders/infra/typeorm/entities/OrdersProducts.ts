import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('orders_products')
class OrdersProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.order_products)
  @JoinColumn({
    name: 'order_id',
  })
  order: Order;

  @ManyToOne(() => Product, product => product.order_products)
  @JoinColumn({
    name: 'product_id',
  })
  product: Product;

  @Column()
  product_id: string;

  @Column()
  order_id: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'decimal',
  })
  quantity: number;

  @CreateDateColumn({
    select: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    select: false,
  })
  updated_at: Date;
}

export default OrdersProducts;
