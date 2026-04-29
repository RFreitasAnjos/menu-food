import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

class ProductOptionDto {
  id: string;
  name: string;
  price: number;
}

class ProductOptionGroupDto {
  id: string;
  name: string;
  required: boolean;
  minSelection: number;
  maxSelection: number;
  options: ProductOptionDto[];
}

export class ProductResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiProperty() basePrice: number;
  @ApiProperty() imageUrl: string;
  @ApiProperty() category: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty({ type: [ProductOptionGroupDto] }) optionGroups: ProductOptionGroupDto[];

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.basePrice = Number(product.basePrice);
    this.imageUrl = product.imageUrl;
    this.category = product.category;
    this.isActive = product.isActive;
    this.optionGroups = (product.optionGroups || []).map((g) => ({
      id: g.id,
      name: g.name,
      required: g.required,
      minSelection: g.minSelection,
      maxSelection: g.maxSelection,
      options: (g.options || []).map((o) => ({
        id: o.id,
        name: o.name,
        price: Number(o.price),
      })),
    }));
  }
}
