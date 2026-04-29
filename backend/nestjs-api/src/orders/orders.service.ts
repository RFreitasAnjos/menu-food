import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { ProductOption } from '../products/entities/product-option.entity';
import { UserAddress } from '../users/entities/user-address.entity';
import { OrderStatus } from './enums/order-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddressVo } from './value-objects/address.vo';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductOption)
    private productOptionRepository: Repository<ProductOption>,
    @InjectRepository(UserAddress)
    private addressRepository: Repository<UserAddress>,
    private config: ConfigService,
  ) {}

  async createOrder(dto: CreateOrderDto, user: User): Promise<Order> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('O carrinho deve conter ao menos 1 item');
    }

    const items: OrderItem[] = [];
    let totalPrice = 0;

    for (const itemDto of dto.items) {
      const product = await this.productRepository.findOne({
        where: { id: itemDto.productId },
        relations: ['optionGroups', 'optionGroups.options'],
      });
      if (!product) {
        throw new NotFoundException(`Produto não encontrado: ${itemDto.productId}`);
      }

      let itemTotal = Number(product.basePrice);

      if (itemDto.optionIds && itemDto.optionIds.length > 0) {
        const options = await this.productOptionRepository.findBy({ id: In(itemDto.optionIds) });
        for (const option of options) {
          // Validate option belongs to this product (security: never trust frontend values)
          const groupProductId = option.group?.product?.id;
          if (groupProductId && groupProductId !== product.id) {
            throw new BadRequestException(
              `Opção '${option.name}' não pertence ao produto '${product.name}'`,
            );
          }
          itemTotal += Number(option.price);
        }
      }

      itemTotal = itemTotal * itemDto.quantity;

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: itemDto.quantity,
        basePrice: product.basePrice,
        totalPrice: itemTotal,
        selectedOptionIds: itemDto.optionIds || [],
      });

      items.push(orderItem);
      totalPrice += itemTotal;
    }

    const address = await this.resolveAddress(dto, user.id);

    const order = this.orderRepository.create({
      userId: user.id,
      status: OrderStatus.WAITING_PAYMENT,
      totalPrice,
      address,
      tableNumber: dto.tableNumber,
      notes: dto.notes,
      items,
    });

    return this.orderRepository.save(order);
  }

  async findById(id: string, user: User): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Pedido não encontrado: ${id}`);
    if (user.role !== UserRole.ADMIN && order.userId !== user.id) {
      throw new ForbiddenException('Acesso negado');
    }
    return order;
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Pedido não encontrado: ${id}`);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async cancelExpiredOrders(): Promise<void> {
    const timeoutMinutes = this.config.get<number>('ORDER_PAYMENT_TIMEOUT_MINUTES', 15);
    const cutoff = new Date(Date.now() - timeoutMinutes * 60 * 1000);

    await this.orderRepository
      .createQueryBuilder()
      .update(Order)
      .set({ status: OrderStatus.CANCELLED })
      .where('status = :status', { status: OrderStatus.WAITING_PAYMENT })
      .andWhere('createdAt < :cutoff', { cutoff })
      .execute();
  }

  private async resolveAddress(dto: CreateOrderDto, userId: string): Promise<AddressVo | undefined> {
    if (dto.tableNumber) return undefined; // Local order — no address needed

    if (dto.addressId) {
      const saved = await this.addressRepository.findOne({
        where: { id: dto.addressId, userId },
      });
      if (!saved) throw new NotFoundException(`Endereço não encontrado: ${dto.addressId}`);
      return {
        street: saved.street,
        number: saved.number,
        neighborhood: saved.neighborhood,
        city: saved.city,
        state: saved.state,
        zipCode: saved.zipCode,
      };
    }

    if (dto.address) {
      return { ...dto.address };
    }

    throw new BadRequestException(
      'Para pedido delivery, informe um endereço (addressId ou address)',
    );
  }
}
