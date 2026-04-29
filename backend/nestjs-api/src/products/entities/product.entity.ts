import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Category } from '../enums/category.enum';
import { ProductOptionGroup } from './product-option-group.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ type: 'enum', enum: Category, nullable: true })
  category: Category;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  basePrice: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => ProductOptionGroup, (group) => group.product, {
    cascade: true,
    eager: true,
  })
  optionGroups: ProductOptionGroup[];
}
