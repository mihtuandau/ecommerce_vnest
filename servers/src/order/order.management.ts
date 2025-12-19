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
    // Clear cache FIRST to ensure we get fresh data from DB
    await this.cacheService.deleteOrder(id);
    
    // Fetch current order from DB (not cache) - MUST be fresh data
    const oldOrder = await this.repository.findById(id);

    if (!oldOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    this.logger.log(`📝 Updating order ${id}: Old status = ${oldOrder.status}, New status = ${dto.status || 'unchanged'}`);

    // Không cho phép cập nhật đơn hàng đã hủy
    if (oldOrder.status === 'CANCELLED') {
      throw new BadRequestException('Cannot update a cancelled order');
    }

    // Update order
    const order = await this.repository.update(id, dto);

    // Create payment record if not exists and status is updated
    await this.handlePaymentCreation(order, oldOrder, dto);

    // Handle delivered status changes - MUST pass oldOrder (before update)
    await this.handleDeliveredStatus(dto, oldOrder);

    // Clear caches after update
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
    this.logger.log(`🔍 handleDeliveredStatus called: dto.status=${dto.status}, oldOrder.status=${oldOrder.status}, orderId=${oldOrder.id}`);
    
    // Only increment soldCount if status is CHANGING TO DELIVERED from non-DELIVERED state
    if (dto.status === 'DELIVERED' && oldOrder.status !== 'DELIVERED') {
      this.logger.log(`📦 Status CHANGING to DELIVERED for order ${oldOrder.id} (was ${oldOrder.status})`);
      this.logger.log(`📊 Order has ${oldOrder.orderItems?.length || 0} items`);
      
      // Update soldCount for each product
      for (const item of oldOrder.orderItems) {
        const productId = item.variant.productId;
        const quantity = item.quantity;
        this.logger.log(`➕ INCREMENTING soldCount: productId=${productId}, quantity=${quantity}`);
        await this.repository.incrementProductSoldCount(productId, quantity);
        this.logger.log(`✅ Incremented soldCount for product ${productId} by ${quantity}`);
      }
      
      // Automatically mark payment as SUCCESS when order is delivered
      if (oldOrder.payment && oldOrder.payment.status !== 'SUCCESS') {
        try {
          await this.paymentService.updateStatus(oldOrder.payment.id, { status: 'SUCCESS' });
          this.logger.log(`✅ Updated payment status to SUCCESS for order ${oldOrder.id}`);
        } catch (error) {
          this.logger.error('Failed to update payment status:', error);
        }
      } else if (oldOrder.payment?.status === 'SUCCESS') {
        this.logger.log(`ℹ️ Payment already SUCCESS for order ${oldOrder.id}`);
      }
    } else if (dto.status === 'DELIVERED' && oldOrder.status === 'DELIVERED') {
      this.logger.warn(`⚠️ Order ${oldOrder.id} is ALREADY DELIVERED, SKIPPING soldCount increment`);
    } else {
      this.logger.log(`ℹ️ Status update but not to DELIVERED (dto=${dto.status}, old=${oldOrder.status}), no soldCount change`);
    }
  }
}