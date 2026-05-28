// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) { }

  create(CreateProductDto: CreateProductDto) {
    const product = this.productRepo.create(CreateProductDto);
    return this.productRepo.save(product);
  }

  findAll() {
    return this.productRepo.find();
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, UpdateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    const updated = Object.assign(product, UpdateProductDto);
    return this.productRepo.save(updated);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return this.productRepo.remove(product);
  }

  async updateStock(id: string, stock: number) {
    const product = await this.findOne(id);
    product.stock = stock;
    return this.productRepo.save(product);
  }

  async toggleAvailability(id: string) {
    const product = await this.findOne(id);
    product.is_available = !product.is_available;
    return this.productRepo.save(product);
  }
}