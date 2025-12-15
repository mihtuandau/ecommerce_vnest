// src/order/order.management.ts
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderCache } from './order.cache';
import { PaymentService } from '../payment/payment.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';
import * as OrderHelper from './order.helper';

@Injectable()
export class OrderManagement {
  private readonly logger = new Logger(OrderManagement.name);

  constructor(
    private repository: OrderRepository,
    private cacheService: OrderCache,
    private paymentService: PaymentService,
  ) {}

  async update(id: number, dto: UpdateOrderDto): Promise<any> {
    const oldOrder = await this.repository.findById(id);

    if (!oldOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Không cho phép cập nhật đơn hàng đã hủy
    if (oldOrder.status === 'CANCELLED') {
      throw new BadRequestException('Cannot update a cancelled order');
    }

    const order = await this.repository.update(id, dto);

    // Create payment record if not exists and status is updated
    await this.handlePaymentCreation(order, oldOrder, dto);

    // Handle delivered status changes
    await this.handleDeliveredStatus(dto, oldOrder);

    // Clear caches
    await this.cacheService.clearRelatedCaches(id, order.userId || undefined);

    return order;
  }

  async remove(id: number): Promise<any> {
    const order = await this.repository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    
    const removed = await this.repository.delete(id);
    await this.cacheService.clearRelatedCaches(id, order.userId || undefined);

    return removed;
  }

  async cancelOrder(orderId: number, userId: number): Promise<any> {
    const order = await this.repository.findById(orderId);
    
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new BadRequestException('Not your order');
    if (!this.canCancelOrder(order.status)) {
      throw new BadRequestException('Cannot cancel order with status: ' + order.status);
    }

    const cancelled = await this.repository.update(orderId, { status: 'CANCELLED' });

    await this.cacheService.clearRelatedCaches(orderId, userId);

    return {
      ...cancelled,
      message: 'Order cancelled successfully'
    };
  }

  async cancelGuestOrder(orderCode: string, contact: string): Promise<any> {
    // Find guest order by orderCode and contact
    const order = await this.repository.findGuestOrderByCodeAndContact(orderCode, contact);
    
    if (!order) {
      throw new NotFoundException('Order not found or contact information does not match');
    }
    
    if (!this.canCancelOrder(order.status)) {
      throw new BadRequestException('Cannot cancel order with status: ' + order.status);
    }

    const cancelled = await this.repository.update(order.id, { status: 'CANCELLED' });

    await this.cacheService.clearRelatedCaches(order.id, order.userId || undefined);

    return {
      ...cancelled,
      message: 'Guest order cancelled successfully'
    };
  }

  private canCancelOrder(status: string): boolean {
    // Chỉ cho phép hủy khi đơn hàng chưa được xác nhận
    const cancellableStatuses = ['PENDING', 'AWAITING_PAYMENT'];
    return cancellableStatuses.includes(status);
  }

  async applyDiscount(orderId: number, dto: ApplyDiscountDto): Promise<any> {
    const order = await this.repository.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    
    const discount = await this.repository.findDiscountByCode(dto.code);
    if (!discount) throw new BadRequestException('Invalid discount');
    
    const newTotal = order.total * (1 - (discount.percentage || 0) / 100) - (discount.fixedAmount || 0);
    
    const updatedOrder = await this.repository.update(orderId, {
      total: newTotal,
      discount: { connect: { id: discount.id } },
    });
    
    await this.cacheService.clearRelatedCaches(orderId, order.userId || undefined);

    return { message: 'Discount applied', discount, updatedOrder };
  }

  async lookupGuestOrder(orderCode: string, contact: string): Promise<any> {
    const order: any = await this.repository.findByCode(orderCode);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if it's a guest order (no userId)
    if (order.userId) {
      throw new BadRequestException('This order requires login to view');
    }

    // Verify contact information (email or phone)
    const contactMatch = order.guestEmail === contact || order.guestPhone === contact;

    if (!contactMatch) {
      throw new BadRequestException('Contact information does not match');
    }

    return order;
  }

  private async handlePaymentCreation(order: any, oldOrder: any, dto: UpdateOrderDto) {
    if (dto.status && !oldOrder.payment) {
      try {
        await this.paymentService.create({
          orderId: order.id,
          method: order.paymentMethod as any,
        });
        this.logger.log(`✅ Created payment for order ${order.id}`);
      } catch (error) {
        this.logger.error('Failed to create payment record:', error);
      }
    }
  }

  private async handleDeliveredStatus(dto: UpdateOrderDto, oldOrder: any) {
    // If status changed to DELIVERED, update soldCount
    if (dto.status === 'DELIVERED' && oldOrder.status !== 'DELIVERED') {
      for (const item of oldOrder.orderItems) {
        await this.repository.incrementProductSoldCount(item.variant.productId, item.quantity);
      }
      this.logger.log(`✅ Updated sold count for order ${oldOrder.id}`);
    }
  }
}