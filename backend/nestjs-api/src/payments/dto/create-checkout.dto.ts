import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutDto {
  @ApiProperty({ description: 'Valor em centavos', example: 2590 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'BRL' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: 'Pedido #123 - MenuFood' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://app.menufood.com.br/orders/123' })
  @IsString()
  @IsNotEmpty()
  returnUrl: string;
}
