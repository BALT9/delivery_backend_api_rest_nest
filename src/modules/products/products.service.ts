// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

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

  async findAll(query: ProductQueryDto) {
    const { page = 1, limit = 10, search } = query;

    const qb = this.productRepo.createQueryBuilder('product');

    // 🔎 SEARCH
    if (search) {
      qb.where(
        'LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    // 📄 PAGINATION
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
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