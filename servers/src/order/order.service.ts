// src/order/order.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderCache } from './order.cache';
import { OrderCreation } from './order.creation';
import { OrderManagement } from './order.management';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';
import * as OrderHelper from './order.helper';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private repository: OrderRepository,
    private cacheService: OrderCache,
    private orderCreation: OrderCreation,
    private orderManagement: OrderManagement,
  ) {}

  async create(userId: number | null, dto: CreateOrderDto): Promise<any> {
    return this.orderCreation.create(userId, dto);
  }

  async findAll(query: QueryOrderDto) {
    const { page = 1, limit = 10, status, userId } = query;
    const skip = (page - 1) * limit;

    // Check cache first
    const cached = await this.cacheService.getOrdersList(query);
    if (cached) {
      return cached;
    }

    const where = {};
    if (status) where['status'] = status;
    if (userId) where['userId'] = userId;

    const [ordersData, total] = await Promise.all([
      this.repository.findAll(where, skip, limit),
      this.repository.count(where),
    ]);

    // Serialize all orders with payment data
    const serializedOrders = ordersData.map(order => OrderHelper.serializeOrder(order));

    const orders = {
      orders: serializedOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    await this.cacheService.setOrdersList(query, orders);

    return orders;
  }

  async findOne(id: number, user: any): Promise<any> {
    const order = await this.repository.findById(id);

    if (!order) {
      throw new NotFoundException(`Đơn hàng #${id} không tồn tại`);
    }

    // Kiểm tra quyền sở hữu (trừ Admin)
    if (user.role !== 'ADMIN' && order.userId !== user.userId) {
      throw new NotFoundException(`Đơn hàng #${id} không tồn tại hoặc không thuộc quyền sở hữu của bạn`);
    }

    return OrderHelper.serializeOrder(order);
  }

  async update(id: number, dto: UpdateOrderDto): Promise<any> {
    return this.orderManagement.update(id, dto);
  }

  async remove(id: number): Promise<any> {
    return this.orderManagement.remove(id);
  }

  async cancelOrder(orderId: number, userId: number): Promise<any> {
    return this.orderManagement.cancelOrder(orderId, userId);
  }

  async cancelGuestOrder(orderCode: string, contact: string): Promise<any> {
    return this.orderManagement.cancelGuestOrder(orderCode, contact);
  }

  async applyDiscount(
    orderId: number,
    dto: ApplyDiscountDto,
    requester: { userId: number; role?: string },
  ): Promise<any> {
    return this.orderManagement.applyDiscount(orderId, dto, requester);
  }

  async lookupGuestOrder(orderCode: string, contact: string): Promise<any> {
    return this.orderManagement.lookupGuestOrder(orderCode, contact);
  }
}