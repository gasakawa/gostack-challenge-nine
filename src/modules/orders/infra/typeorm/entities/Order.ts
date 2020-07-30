import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  Column,
  ManyToOne,
} from 'typeorm';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    select: false,
  })
  customer_id: string;

  @ManyToOne(() => Customer, customer => customer.order, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => OrdersProducts, ordersProducts => ordersProducts.order, {
    eager: true,
    cascade: ['insert'],
  })
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

export default Order;
