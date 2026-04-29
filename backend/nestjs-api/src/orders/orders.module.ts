import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { ProductOption } from '../products/entities/product-option.entity';
import { UserAddress } from '../users/entities/user-address.entity';
import { CancelExpiredOrdersScheduler } from './scheduler/cancel-expired-orders.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, ProductOption, UserAddress]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, CancelExpiredOrdersScheduler],
  exports: [OrdersService],
})
export class OrdersModule {}
