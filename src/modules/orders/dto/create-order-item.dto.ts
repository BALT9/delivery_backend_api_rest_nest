import { IsInt, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {

  @ApiProperty({
    example: 'b3c1a2f0-9c2d-4f2e-8b1a-123456789abc',
    description: 'ID del producto',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'Cantidad del producto (mínimo 1)',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}