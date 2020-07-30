import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'decimal',
  })
  price: number;

  @Column({
    type: 'int',
  })
  quantity: number;

  @OneToMany(() => OrdersProducts, ordersProducts => ordersProducts.product)
  order_products: OrdersProducts[];

  @CreateDateColumn({
    select: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    select: false,
  })
  updated_at: Date;
}

export default Product;
