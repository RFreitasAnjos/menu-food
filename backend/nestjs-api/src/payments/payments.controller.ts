import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@Controller('api/v1')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private paymentsService: PaymentsService) {}

  @Post('payments/checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Criar checkout InfinitePay' })
  async createCheckout(@Body() dto: CreateCheckoutDto): Promise<{ checkoutUrl: string }> {
    const checkoutUrl = await this.paymentsService.createCheckout(dto);
    return { checkoutUrl };
  }

  @Post('webhooks/infinitepay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook InfinitePay' })
  handleWebhook(@Body() payload: Record<string, any>): void {
    const { status, paymentId } = payload;

    if (status === 'Paid') {
      this.logger.log(`Pagamento ${paymentId} confirmado`);
      // TODO: update order status to CONFIRMED
    } else if (status === 'Failed') {
      this.logger.warn(`Pagamento ${paymentId} falhou`);
      // TODO: update order status to PENDING_PAYMENT
    }
  }
}
