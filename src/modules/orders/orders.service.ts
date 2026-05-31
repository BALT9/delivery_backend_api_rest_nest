import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) { }

  // =========================
  // CREAR ORDEN
  // =========================
  async create(dto: CreateOrderDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let total = 0;
      const items: OrderItem[] = [];

      for (const item of dto.items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException('Product not found');
        }

        if (!product.is_available) {
          throw new BadRequestException('Product not available');
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException('Not enough stock');
        }

        const subtotal = Number(product.price) * item.quantity;
        total += subtotal;

        const orderItem = this.itemRepo.create({
          product,
          quantity: item.quantity,
          price: product.price,
          subtotal,
        });

        items.push(orderItem);

        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
      }

      const order = this.orderRepo.create({
        user: { id: userId } as any,
        total,
        status: OrderStatus.PENDING,
        items,
      });

      const savedOrder = await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // =========================
  // HISTORIAL CLIENTE
  // =========================
  findByUser(userId: string) {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { created_at: 'DESC' },
    });
  }

  // =========================
  // TODOS LOS PEDIDOS (ADMIN)
  // =========================
  findAll() {
    return this.orderRepo.find({
      relations: ['user', 'items', 'items.product'],
      order: { created_at: 'DESC' },
    });
  }

  // =========================
  // UN PEDIDO
  // =========================
  async findOne(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // =========================
  // CAMBIAR ESTADO
  // =========================
  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderRepo.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;
    return this.orderRepo.save(order);
  }
}