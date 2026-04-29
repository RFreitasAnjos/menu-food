import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';

class OrderItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  basePrice: number;
  totalPrice: number;
  selectedOptionIds: string[];
}

export class OrderResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() userId: string;
  @ApiProperty() status: string;
  @ApiProperty() totalPrice: number;
  @ApiProperty() address: object;
  @ApiProperty() tableNumber: string;
  @ApiProperty() notes: string;
  @ApiProperty({ type: [OrderItemResponseDto] }) items: OrderItemResponseDto[];
  @ApiProperty() createdAt: Date;

  constructor(order: Order) {
    this.id = order.id;
    this.userId = order.userId;
    this.status = order.status;
    this.totalPrice = Number(order.totalPrice);
    this.address = order.address;
    this.tableNumber = order.tableNumber;
    this.notes = order.notes;
    this.createdAt = order.createdAt;
    this.items = (order.items || []).map((item) => ({
      id: item.id,
      productId: item.product?.id,
      productName: item.product?.name,
      quantity: item.quantity,
      basePrice: Number(item.basePrice),
      totalPrice: Number(item.totalPrice),
      selectedOptionIds: item.selectedOptionIds || [],
    }));
  }
}
