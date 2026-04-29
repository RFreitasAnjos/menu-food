import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_addresses')
export class UserAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @Column({ length: 50, nullable: true })
  label: string;

  @Column({ nullable: false })
  street: string;

  @Column({ length: 20, nullable: false })
  number: string;

  @Column({ length: 100, nullable: false })
  neighborhood: string;

  @Column({ length: 100, nullable: false })
  city: string;

  @Column({ length: 2, nullable: false })
  state: string;

  @Column({ nullable: true })
  zipCode: string;
}
