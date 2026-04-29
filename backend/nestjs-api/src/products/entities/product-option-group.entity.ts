import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductOption } from './product-option.entity';

@Entity('product_option_groups')
export class ProductOptionGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  required: boolean;

  @Column({ default: 0 })
  minSelection: number;

  @Column({ default: 1 })
  maxSelection: number;

  @ManyToOne(() => Product, (product) => product.optionGroups, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => ProductOption, (option) => option.group, {
    cascade: true,
    eager: true,
  })
  options: ProductOption[];
}
