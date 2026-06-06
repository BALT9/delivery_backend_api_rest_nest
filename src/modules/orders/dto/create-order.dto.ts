import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {

    userId?: string;

    @ApiProperty({
        description: 'Lista de productos del pedido (carrito)',
        type: [CreateOrderItemDto],
        example: [
            {
                productId: 'b3c1a2f0-9c2d-4f2e-8b1a-123456789abc',
                quantity: 2,
            },
            {
                productId: 'a91d2c33-7f12-4b11-9f22-987654321def',
                quantity: 1,
            },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}