import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  async createCheckout(dto: CreateCheckoutDto): Promise<string> {
    const apiKey = this.config.get<string>('INFINITEPAY_API_KEY');
    const baseUrl = this.config.get<string>('INFINITEPAY_API_BASE_URL');

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${baseUrl}/checkout`,
          {
            amount: dto.amount,
            currency: dto.currency,
            description: dto.description,
            returnUrl: dto.returnUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      return response.data.checkoutUrl;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar checkout no InfinitePay');
    }
  }
}
