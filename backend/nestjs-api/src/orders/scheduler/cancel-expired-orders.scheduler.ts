import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrdersService } from '../orders.service';

@Injectable()
export class CancelExpiredOrdersScheduler {
  private readonly logger = new Logger(CancelExpiredOrdersScheduler.name);

  constructor(private ordersService: OrdersService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Verificando pedidos com pagamento expirado...');
    await this.ordersService.cancelExpiredOrders();
  }
}
