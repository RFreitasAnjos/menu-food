import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Orders')
@Controller('api/v1/client/orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearerAuth')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar pedido' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  async createOrder(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: User,
  ): Promise<OrderResponseDto> {
    const order = await this.ordersService.createOrder(dto, user);
    return new OrderResponseDto(order);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pedidos do usuário autenticado' })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  async listMyOrders(@CurrentUser() user: User): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findByUser(user.id);
    return orders.map((o) => new OrderResponseDto(o));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um pedido' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async getOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<OrderResponseDto> {
    return new OrderResponseDto(await this.ordersService.findById(id, user));
  }
}
