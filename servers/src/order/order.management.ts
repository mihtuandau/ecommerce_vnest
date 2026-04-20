
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderCache } from './order.cache';
import { PaymentService } from '../payment/payment.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';
import * as OrderHelper from './order.helper';
import { GHNService } from '../ghn/ghn.service';

@Injectable()
export class OrderManagement {
  private readonly logger = new Logger(OrderManagement.name);

  constructor(
    private repository: OrderRepository,
    private cacheService: OrderCache,
    private paymentService: PaymentService,
    private ghnService: GHNService,
  ) {}

  async update(id: number, dto: UpdateOrderDto): Promise<any> {

    await this.cacheService.deleteOrder(id);

    const oldOrder = await this.repository.findById(id);

    if (!oldOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (oldOrder.status === 'CANCELLED') {
      throw new BadRequestException('Cannot update a cancelled order');
    }


    const order = await this.repository.update(id, dto);

    await this.handlePaymentCreation(order, oldOrder, dto);

    await this.handleDeliveredStatus(dto, oldOrder);

    if (dto.status === 'CANCELLED') {
      await this.repository.restoreOrderStock(id);

      // Nếu đơn hàng cũ đã được giao (đã tăng soldCount), thì phải trừ lại
      if (oldOrder.status === 'DELIVERED') {
        for (const item of oldOrder.orderItems) {
          await this.repository.decrementProductSoldCount(item.variant.productId, item.quantity);
        }
      }
    }

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

  async cancelOrder(orderId: number, userId: number, isAdmin = false): Promise<any> {
    const order = await this.repository.findById(orderId);
    
    if (!order) throw new NotFoundException('Order not found');
    
    // Nếu không phải Admin thì mới kiểm tra sở hữu đơn hàng
    if (!isAdmin && order.userId !== userId) {
      throw new BadRequestException('Not your order');
    }

    if (!this.canCancelOrder(order.status)) {
      throw new BadRequestException('Cannot cancel order with status: ' + order.status);
    }

    const cancelled = await this.repository.update(orderId, { status: 'CANCELLED' });

    // Đồng bộ trạng thái thanh toán nếu có
    if (order.payment && order.payment.status === 'PENDING') {
      await this.paymentService.updateStatus(order.payment.id, { status: 'CANCELLED' });
    }

    await this.repository.restoreOrderStock(orderId);

    await this.cacheService.clearRelatedCaches(orderId, userId);

    return {
      ...cancelled,
      message: 'Order cancelled successfully'
    };
  }

  async cancelGuestOrder(orderCode: string, contact: string): Promise<any> {

    const order = await this.repository.findGuestOrderByCodeAndContact(orderCode, contact);
    
    if (!order) {
      throw new NotFoundException('Order not found or contact information does not match');
    }
    
    if (!this.canCancelOrder(order.status)) {
      throw new BadRequestException('Cannot cancel order with status: ' + order.status);
    }

    const cancelled = await this.repository.update(order.id, { status: 'CANCELLED' });

    await this.repository.restoreOrderStock(order.id);

    await this.cacheService.clearRelatedCaches(order.id, order.userId || undefined);

    return {
      ...cancelled,
      message: 'Guest order cancelled successfully'
    };
  }

  private canCancelOrder(status: string): boolean {

    const cancellableStatuses = ['PENDING', 'AWAITING_PAYMENT'];
    return cancellableStatuses.includes(status);
  }

  async applyDiscount(
    orderId: number,
    dto: ApplyDiscountDto,
    requester: { userId: number; role?: string },
  ): Promise<any> {
    const order = await this.repository.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    const isAdmin = requester.role === 'ADMIN';
    if (!isAdmin && order.userId !== requester.userId) {
      throw new BadRequestException('Not your order');
    }

    if (!['PENDING', 'AWAITING_PAYMENT'].includes(order.status)) {
      throw new BadRequestException('Chỉ có thể áp mã cho đơn chưa xác nhận thanh toán');
    }
    
    const discount = await this.repository.findDiscountByCode(dto.code);
    if (!discount) throw new BadRequestException('Invalid discount');

    if (discount.isFlashSale) {
      throw new BadRequestException('Mã Flash Sale đã được áp dụng tự động, không cần nhập thêm');
    }

    const subtotal = order.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const usageCount = await this.repository.countOrdersUsingDiscount(discount.id);
    OrderHelper.validateDiscount(discount, subtotal, usageCount);

    const totals = OrderHelper.calculateOrderTotal(
      order.orderItems.map((item) => ({ quantity: item.quantity, price: item.price })),
      order.total - order.subtotal,
      {
        percentage: discount.percentage || undefined,
        fixedAmount: discount.fixedAmount || undefined,
        maxDiscountAmount: discount.maxDiscountAmount || undefined,
      },
    );
    
    const updatedOrder = await this.repository.update(orderId, {
      subtotal: totals.totalItems,
      discountAmount: totals.discountAmount,
      total: totals.discountedTotal,
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

    if (order.userId) {
      throw new BadRequestException('This order requires login to view');
    }

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

      } catch (error) {
        this.logger.error('Failed to create payment record:', error);
      }
    }
  }

  private async handleDeliveredStatus(dto: UpdateOrderDto, oldOrder: any) {

    if (dto.status === 'DELIVERED' && oldOrder.status !== 'DELIVERED') {


      for (const item of oldOrder.orderItems) {
        const productId = item.variant.productId;
        const quantity = item.quantity;

        await this.repository.incrementProductSoldCount(productId, quantity);

      }

      if (oldOrder.payment && oldOrder.payment.status !== 'SUCCESS') {
        try {
          await this.paymentService.updateStatus(oldOrder.payment.id, { status: 'SUCCESS' });

        } catch (error) {
          this.logger.error('Failed to update payment status:', error);
        }
      } else if (oldOrder.payment?.status === 'SUCCESS') {

      }
    } else if (dto.status === 'DELIVERED' && oldOrder.status === 'DELIVERED') {
      this.logger.warn(` Order ${oldOrder.id} is ALREADY DELIVERED, SKIPPING soldCount increment`);
    } else {

    }
  }

  /**
   * Đồng bộ đơn hàng sang GHN để lấy mã vận đơn
   */
  async syncToGHN(id: number): Promise<any> {
    const order = await this.repository.findById(id);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (order.shippingCode) throw new BadRequestException('Đơn hàng này đã được tạo vận đơn trước đó');

    const address = order.address || (order.shippingSnapshot as any);
    const dCode = address.districtCode;
    const wCode = address.wardCode;
    
    if (!address || !dCode || !wCode) {
      throw new BadRequestException('Địa chỉ giao hàng không đầy đủ thông tin mã vùng GHN (Quận/Huyện hoặc Phường/Xã)');
    }

    const totalWeight = order.orderItems.reduce((sum, item) => sum + (item.weight || 200) * item.quantity, 0);
    const maxLength = Math.max(...order.orderItems.map(i => (i.variantSnapshot as any)?.length || 10));
    const maxWidth = Math.max(...order.orderItems.map(i => (i.variantSnapshot as any)?.width || 10));
    const totalHeight = order.orderItems.reduce((sum, i) => sum + ((i.variantSnapshot as any)?.height || 5) * i.quantity, 0);

    // Luôn để Shop trả phí cho GHN (1: Shop, 2: Khách)
    // Vì phí ship đã được tính vào tổng tiền (total) và thu từ khách qua COD rồi.
    const paymentTypeId = 1;

    const ghnData = {
      payment_type_id: paymentTypeId,
      note: "Hàng TMĐT E-Co Vnest",
      required_note: "KHONGCHOXEMHANG",
      client_order_code: order.orderCode,
      to_name: address.fullName || "Khách hàng",
      to_phone: address.phone || order.guestPhone || "0900000000",
      to_address: address.street || "Địa chỉ khách hàng",
      to_ward_code: address.wardCode,
      to_district_id: Number(address.districtCode),
      cod_amount: order.payment?.method === 'CASH' ? Math.round(order.total) : 0,
      content: `Đơn hàng ${order.orderCode}`,
      weight: Math.min(totalWeight, 30000),
      length: Math.min(maxLength, 150),
      width: Math.min(maxWidth, 150),
      height: Math.min(totalHeight, 150),
      service_type_id: 2, // Giao hàng chuẩn/lẻ
      items: order.orderItems.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        weight: item.weight || 200
      }))
    };

    try {
      const result = await this.ghnService.createOrder(ghnData);
      const shippingCode = result.data.order_code;

      const updated = await this.repository.update(id, {
        shippingCode: shippingCode,
        status: 'SHIPPED', // Tự động chuyển trạng thái đơn hàng sang SHIPPED
      } as any);

      await this.cacheService.clearRelatedCaches(id, order.userId || undefined);
      return {
        message: 'Đã tạo vận đơn GHN thành công',
        shippingCode: shippingCode,
        ghnResponse: result.data,
        updatedOrder: updated
      };
    } catch (error) {
      this.logger.error('Lỗi khi đồng bộ đơn sang GHN:', error.response?.data || error.message);
      throw new BadRequestException('Không thể tạo vận đơn trên hệ thống GHN: ' + (error.response?.data?.message || error.message));
    }
  }
}





