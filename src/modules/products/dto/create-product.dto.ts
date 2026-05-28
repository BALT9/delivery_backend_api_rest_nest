import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {

  @ApiProperty({
    example: 'Hamburguesa Clásica',
    description: 'Nombre del producto',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Hamburguesa con carne, queso y vegetales',
    description: 'Descripción del producto',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 25.5,
    description: 'Precio del producto',
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'URL de la imagen del producto',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    example: 50,
    description: 'Cantidad en stock',
  })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Disponibilidad del producto',
  })
  @IsOptional()
  @IsBoolean()
  is_available?: boolean;
}