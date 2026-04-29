import { ApiProperty } from '@nestjs/swagger';
import { UserAddress } from '../entities/user-address.entity';

export class AddressResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() label: string;
  @ApiProperty() street: string;
  @ApiProperty() number: string;
  @ApiProperty() neighborhood: string;
  @ApiProperty() city: string;
  @ApiProperty() state: string;
  @ApiProperty() zipCode: string;

  constructor(address: UserAddress) {
    this.id = address.id;
    this.label = address.label;
    this.street = address.street;
    this.number = address.number;
    this.neighborhood = address.neighborhood;
    this.city = address.city;
    this.state = address.state;
    this.zipCode = address.zipCode;
  }
}
