import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order.entity';

import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { UserRole } from '../users/dto/create-user.dto';

@Controller('orders')
@UseGuards(AuthGuard) // 👈 base: todos deben estar autenticados
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  // =========================
  // CLIENTE: CREAR PEDIDO
  // =========================
  @Post()
  create(@Req() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto, req.user.id);
  }

  // =========================
  // CLIENTE: MIS PEDIDOS
  // =========================
  @Get('my-orders')
  findMyOrders(@Req() req) {
    return this.ordersService.findByUser(req.user.id);
  }

  // =========================
  // ADMIN: VER TODOS LOS PEDIDOS
  // =========================
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // =========================
  // ADMIN: VER UN PEDIDO
  // =========================
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  // =========================
  // ADMIN: CAMBIAR ESTADO
  // =========================
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus },
  ) {
    return this.ordersService.updateStatus(id, body.status);
  }
}