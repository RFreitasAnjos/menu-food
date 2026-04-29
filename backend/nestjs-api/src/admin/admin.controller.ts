import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ChangeRoleDto } from './dto/change-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { OrderStatus } from '../orders/enums/order-status.enum';

@ApiTags('Admin')
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth('bearerAuth')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ── Users ──────────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'Listar todos os usuários' })
  listUsers() {
    return this.adminService.findAllUsers();
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Alterar role do usuário' })
  changeRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeRoleDto,
  ) {
    return this.adminService.changeUserRole(id, dto);
  }

  // ── Orders ─────────────────────────────────────────────

  @Get('orders')
  @ApiOperation({ summary: 'Listar todos os pedidos' })
  listOrders() {
    return this.adminService.findAllOrders();
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Atualizar status de um pedido' })
  updateOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.adminService.updateOrderStatus(id, status);
  }

  // ── Billing ────────────────────────────────────────────

  @Get('billing/stats')
  @ApiOperation({ summary: 'Estatísticas de faturamento' })
  getBillingStats() {
    return this.adminService.getBillingStats();
  }
}
