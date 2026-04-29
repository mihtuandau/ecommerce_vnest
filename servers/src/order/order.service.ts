
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
import { PrismaService } from '../prisma/prisma.service';
import { GHNService } from '../ghn/ghn.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private repository: OrderRepository,
    private cacheService: OrderCache,
    private orderCreation: OrderCreation,
    private orderManagement: OrderManagement,
    private prisma: PrismaService,
    private ghnService: GHNService,
  ) {}

  async create(userId: number | null, dto: CreateOrderDto, requester: { role: string }, ipAddr: string = '127.0.0.1'): Promise<any> {
    return this.orderCreation.create(userId, dto, requester, ipAddr);
  }

  async findAll(query: QueryOrderDto) {
    const { page = 1, limit = 10, status, userId } = query;
    const skip = (page - 1) * limit;

    // Tạo khóa cache đặc biệt bao gồm cả role và userId để tránh sai lệch dữ liệu
    const cacheKey = { ...query, requesterId: userId };
    const cached = await this.cacheService.getOrdersList(cacheKey);
    if (cached) return cached;

    const where: any = {};
    if (status) where['status'] = status;
    if (userId) where['userId'] = userId;

    const [ordersData, total] = await Promise.all([
      this.repository.findAll(where, skip, limit),
      this.repository.count(where),
    ]);

    const serializedOrders = ordersData.map(order => OrderHelper.serializeOrder(order));

    const orders = {
      orders: serializedOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    await this.cacheService.setOrdersList(cacheKey, orders);
    return orders;
  }

  async findOne(id: number, user: any): Promise<any> {
    const order = await this.repository.findById(id);

    if (!order) {
      throw new NotFoundException(`Đơn hàng #${id} không tồn tại`);
    }

    const isStaff = ['ADMIN', 'KHO', 'BAN_HANG'].includes(user.role);
    if (!isStaff && order.userId !== user.userId) {
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

  async cancelOrder(orderId: number, user: any): Promise<any> {
    const isAdmin = user.role === 'ADMIN';
    return this.orderManagement.cancelOrder(orderId, user.userId, isAdmin);
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

  async syncToGHN(id: number) {
    return this.orderManagement.syncToGHN(id);
  }

  async lookupGuestOrder(orderCode: string, contact: string, ip?: string, ua?: string, maskPII = true): Promise<any> {
    // Log tracking for audit
    this.logger.log(`Guest lookup attempt: Order ${orderCode} | Contact ${contact} | IP: ${ip} | UA: ${ua}`);
    return this.orderManagement.lookupGuestOrder(orderCode, contact, maskPII);
  }

  async handleGHNWebhook(payload: any) {
    const analysis = await this.ghnService.handleStatusWebhook(payload);
    if (!analysis) return { success: true, message: 'Status ignored' };

    const { shippingCode, status, description } = analysis;
    const order = await this.repository.findByShippingCode(shippingCode);

    if (!order) {
      this.logger.warn(`[GHN Webhook] Order not found for shipping code: ${shippingCode}`);
      return { success: true, message: 'Order not found' };
    }

    // Chỉ cập nhật nếu trạng thái thực sự thay đổi
    if (order.status !== status && order.status !== 'DELIVERED') {
      this.logger.log(`[GHN Webhook] Updating order #${order.id} status: ${order.status} -> ${status} (${description || ''})`);
      await this.orderManagement.update(order.id, { status: status as any });
    }

    return { code: 200, message: 'Success' };
  }
}
