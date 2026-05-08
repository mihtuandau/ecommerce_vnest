
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderRepository } from './order.repository';
import { OrderCache } from './order.cache';
import { PaymentService } from '../payment/payment.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';
import * as OrderHelper from './order.helper';
import { GHNService } from '../ghn/ghn.service';
import { MailService } from '../mail/mail.service';
import dayjs from 'dayjs';

@Injectable()
export class OrderManagement {
  private readonly logger = new Logger(OrderManagement.name);

  constructor(
    private repository: OrderRepository,
    private cacheService: OrderCache,
    private paymentService: PaymentService,
    private ghnService: GHNService,
    private mailService: MailService,
  ) {}

  /**
   * Tự động hủy các đơn hàng PENDING quá 30 phút mà chưa thanh toán
   * Giúp giải phóng tồn kho bị giữ ảo
   */
  @Cron('0 */15 * * * *') // Chạy mỗi 15 phút
  async handleAutoCancelAbandonedOrders() {
    this.logger.log('[Cron] Checking for abandoned orders...');
    
    const thirtyMinsAgo = dayjs().subtract(30, 'minute').toDate();
    
    // Tìm các đơn hàng PENDING được tạo từ 30 phút trước
    const abandonedOrders = await this.repository.findAbandonedOrders(thirtyMinsAgo);
    
    if (abandonedOrders.length === 0) {
      return;
    }

    this.logger.log(`[Cron] Found ${abandonedOrders.length} abandoned orders. Processing auto-cancel...`);

    for (const order of abandonedOrders) {
      try {
        // KIỂM TRA LẠI TRẠNG THÁI THỰC TẾ TRONG DB (Tránh Race Condition)
        const currentOrder = await this.repository.findById(order.id);
        if (!currentOrder || currentOrder.status !== 'PENDING' || currentOrder.payment?.status === 'SUCCESS') {
          continue;
        }

        this.logger.log(`[Cron] Auto-cancelling abandoned order ${order.orderCode} (ID: ${order.id})`);

        // Sử dụng Transaction để đảm bảo tính nguyên tử
        await this.repository.cancelAndRestore(order.id, order.payment?.id);

        await this.cacheService.clearRelatedCaches(order.id, order.userId || undefined);
      } catch (err) {
        this.logger.error(`[Cron] Failed to auto-cancel order ${order.id}:`, err.message);
      }
    }
  }

  async update(id: number, dto: UpdateOrderDto): Promise<any> {

    await this.cacheService.deleteOrder(id);

    const oldOrder = await this.repository.findById(id);

    if (!oldOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (oldOrder.status === 'CANCELLED') {
      throw new BadRequestException('Cannot update a cancelled order');
    }


    // Handle deliveredAt timestamp
    const updateData: any = { ...dto };
    
    if (dto.status === 'DELIVERED' && oldOrder.status !== 'DELIVERED') {
      updateData.deliveredAt = new Date();
      this.logger.log(`[OrderManagement] Marking order ${id} as delivered at ${updateData.deliveredAt}`);
    } else if (oldOrder.status === 'DELIVERED' && dto.status && dto.status !== 'DELIVERED') {
      updateData.deliveredAt = null;
    }

    const order = await this.repository.update(id, updateData);

    await this.handlePaymentCreation(order, oldOrder, dto);

    await this.handleDeliveredStatus(dto, oldOrder);

    if (dto.status === 'CANCELLED' || dto.status === 'RETURNED') {
      const isAlreadyRestored = oldOrder.status === 'RETURNED';
      
      if (!isAlreadyRestored) {
        const actionLabel = dto.status === 'CANCELLED' ? 'cancelled' : 'returned';
        this.logger.log(`[OrderManagement] Order ${id} is being ${actionLabel}. Restoring stock...`);
        await this.repository.restoreOrderStock(id);
        
        if (dto.status === 'CANCELLED') {
          await this.repository.restoreDiscountUsage(id);
          
          // Gửi email thông báo hủy đơn
          const email = order.guestEmail || order.user?.email;
          if (email) {
            this.mailService.sendOrderCancelled(
              email, 
              order.orderCode, 
              order.fullName || order.user?.name || "Khách hàng",
              (dto as any).cancelReason || "Đơn hàng bị hủy bởi hệ thống hoặc quản trị viên"
            ).catch(e => this.logger.error("Failed to send cancellation email:", e));
          }
        }

        // Tự động hoàn tiền nếu admin đánh dấu RETURNED cho đơn hàng đã thanh toán Online
        if (dto.status === 'RETURNED' && order.payment && order.payment.status === 'SUCCESS') {
          try {
            this.logger.log(`[OrderManagement] Initiating full refund for manually RETURNED order ${id}`);
            await this.paymentService.initiateRefund(order.payment.id);
          } catch (error) {
            this.logger.error('Failed to initiate refund for manual RETURNED status:', error);
          }
        }

        this.logger.log(`[OrderManagement] Stock restoration for order ${id} completed.`);
      } else {
        this.logger.log(`[OrderManagement] Order ${id} was already ${oldOrder.status}. Skipping stock restoration.`);
      }
    }

    await this.cacheService.clearRelatedCaches(id, order.userId || undefined);

    return order;
  }

  async remove(id: number): Promise<any> {
    const order = await this.repository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    
    // Nếu đơn hàng chưa bị hủy mà lại bị xóa, chúng ta cũng nên hoàn lại tồn kho
    if (order.status !== 'CANCELLED' && order.status !== 'RETURNED') {
      this.logger.log(`[OrderManagement] Order ${id} is being deleted without prior cancellation. Restoring stock before deletion...`);
      await this.repository.restoreOrderStock(id);
      await this.repository.restoreDiscountUsage(id);
      
      // Nếu đơn hàng đã giao hoặc đang yêu cầu trả hàng (nghĩa là đã tính vào soldCount), phải trừ soldCount
      if (order.status === 'DELIVERED' || order.status === 'RETURN_REQUESTED') {
        for (const item of order.orderItems) {
          // Tính toán số lượng chưa được hoàn trả trước đó để trừ soldCount chính xác
          const alreadyReturned = (item as any).returnItems?.reduce((sum: number, ri: any) => 
            (ri.returnRequest?.status === 'RECEIVED' || ri.returnRequest?.status === 'COMPLETED') ? sum + ri.quantity : sum, 0) || 0;
          
          const quantityToDecrement = item.quantity - alreadyReturned;
          
          if (quantityToDecrement > 0) {
            await this.repository.decrementProductSoldCount(item.variant.productId, quantityToDecrement).catch(() => {});
          }
        }
      }
    }

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

    this.logger.log(`[OrderManagement] Member order ${orderId} cancelled by user ${userId}. Restoring stock...`);
    
    const paymentIdToCancel = (order.payment && order.payment.status === 'PENDING') ? order.payment.id : undefined;
    const cancelled = await this.repository.cancelAndRestore(orderId, paymentIdToCancel);

    // Initiate refund separately as it's an external API call
    if (order.payment && order.payment.status === 'SUCCESS') {
      try {
        await this.paymentService.initiateRefund(order.payment.id);
      } catch (error) {
        this.logger.error('Failed to initiate refund during order cancellation:', error);
      }
    }
    this.logger.log(`[OrderManagement] Stock restoration for member order ${orderId} completed.`);

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

    this.logger.log(`[OrderManagement] Guest order ${order.id} (${orderCode}) cancelled. Restoring stock...`);
    
    const paymentIdToCancel = (order.payment && order.payment.status === 'PENDING') ? order.payment.id : undefined;
    const cancelled = await this.repository.cancelAndRestore(order.id, paymentIdToCancel);
    
    // Initiate refund separately
    if (order.payment && order.payment.status === 'SUCCESS') {
      try {
        await this.paymentService.initiateRefund(order.payment.id);
      } catch (error) {
        this.logger.error('Failed to refund guest order:', error);
      }
    }
    this.logger.log(`[OrderManagement] Stock restoration for guest order ${order.id} completed.`);

    await this.cacheService.clearRelatedCaches(order.id, order.userId || undefined);

    return {
      ...cancelled,
      message: 'Guest order cancelled successfully'
    };
  }

  private canCancelOrder(status: string): boolean {

    const cancellableStatuses = ['PENDING', 'PROCESSING'];
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

    // Single source of truth: dùng Discount.usageCount field
    OrderHelper.validateDiscount(discount, subtotal, discount.usageCount);

    const totals = OrderHelper.calculateOrderTotal(
      order.orderItems.map((item) => ({ quantity: item.quantity, price: item.price })),
      order.shippingFee,
      {
        percentage: discount.percentage || undefined,
        fixedAmount: discount.fixedAmount || undefined,
        maxDiscountAmount: discount.maxDiscountAmount || undefined,
      },
    );
    
    try {
      const updatedOrder = await this.repository.applyDiscountTransactional(orderId, discount, totals);
      await this.cacheService.clearRelatedCaches(orderId, order.userId || undefined);
      return { message: 'Discount applied', discount, updatedOrder };
    } catch (err) {
      throw new BadRequestException(err.message || 'Không thể áp dụng mã giảm giá');
    }
  }

  async lookupGuestOrder(orderCode: string, contact: string, maskPII = true): Promise<any> {
    const order: any = await this.repository.findByCode(orderCode);

    // Allow lookup even if order belongs to a user, as long as contact info matches
    const contactMatch = order && (
      order.guestEmail === contact || 
      order.guestPhone === contact || 
      order.phone === contact ||
      order.user?.email === contact ||
      order.user?.phone === contact
    );

    if (!order || !contactMatch) {
      throw new NotFoundException('Không tìm thấy đơn hàng hoặc thông tin liên hệ không khớp');
    }

    return OrderHelper.serializeOrder(order, maskPII);
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
    if (dto.status === 'DELIVERED') {
      // 1. Update Payment status to SUCCESS if not already
      if (oldOrder.payment && oldOrder.payment.status !== 'SUCCESS') {
        try {
          await this.paymentService.updateStatus(oldOrder.payment.id, { status: 'SUCCESS' });
          this.logger.log(`Automatically marked payment ${oldOrder.payment.id} as SUCCESS for delivered order ${oldOrder.id}`);
        } catch (error) {
          this.logger.error('Failed to update payment status for delivered order:', error);
        }
      }

      // 2. Increment soldCount for each product if it wasn't DELIVERED before
      if (oldOrder.status !== 'DELIVERED') {
        for (const item of oldOrder.orderItems) {
          try {
            await this.repository.incrementProductSoldCount(item.variant.productId, item.quantity);
          } catch (error) {
            this.logger.error(`Failed to increment soldCount for product ${item.variant.productId}:`, error);
          }
        }
      }
      // 3. Send email notification
      if (oldOrder.status !== 'DELIVERED') {
        const email = oldOrder.guestEmail || oldOrder.user?.email;
        if (email) {
          this.mailService.sendOrderDelivered(
            email, 
            oldOrder.orderCode, 
            oldOrder.fullName || oldOrder.user?.name || "Khách hàng"
          ).catch(e => this.logger.error("Failed to send delivery success email:", e));
        }
      }
    } else {
      // If status is changed FROM DELIVERED to something else (e.g. back to PROCESSING or CANCELLED)
      if (oldOrder.status === 'DELIVERED' || oldOrder.status === 'RETURN_REQUESTED') {
        for (const item of oldOrder.orderItems) {
          try {
            // Chỉ trừ số lượng sản phẩm THỰC TẾ đang được tính là đã bán (loại trừ phần đã trả hàng)
            const alreadyReturned = item.returnItems?.reduce((sum: number, ri: any) => 
              (ri.returnRequest?.status === 'RECEIVED' || ri.returnRequest?.status === 'COMPLETED') ? sum + ri.quantity : sum, 0) || 0;
            
            const quantityToDecrement = item.quantity - alreadyReturned;
            
            if (quantityToDecrement > 0) {
              await this.repository.decrementProductSoldCount(item.variant.productId, quantityToDecrement);
            }
          } catch (error) {
            this.logger.error(`Failed to decrement soldCount for product ${item.variant.productId}:`, error);
          }
        }
      }
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

    // Filter out items from deleted products
    const activeItems = order.orderItems.filter(item => {
      const product = item.variant?.product;
      return !product?.deletedAt;
    });

    if (activeItems.length === 0) {
      throw new BadRequestException('Không có sản phẩm hợp lệ trong đơn hàng (các sản phẩm đã bị xóa)');
    }

    const totalWeight = activeItems.reduce((sum, item) => sum + (item.weight || 200) * item.quantity, 0);
    const maxLength = Math.max(...activeItems.map(i => (i.variantSnapshot as any)?.length || 10));
    const maxWidth = Math.max(...activeItems.map(i => (i.variantSnapshot as any)?.width || 10));
    const totalHeight = activeItems.reduce((sum, i) => sum + ((i.variantSnapshot as any)?.height || 5) * i.quantity, 0);

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
      cod_amount: (order.payment?.status !== 'SUCCESS' && ['CASH', 'COD'].includes((order.paymentMethod || order.payment?.method || '') as string))
        ? Math.round(order.total) 
        : 0,
      content: `Đơn hàng ${order.orderCode}`,
      weight: Math.min(totalWeight, 30000),
      length: Math.min(maxLength, 150),
      width: Math.min(maxWidth, 150),
      height: Math.min(totalHeight, 150),
      service_type_id: 2, // Giao hàng chuẩn/lẻ
      items: activeItems.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        weight: item.weight || 200
      }))
    };

    // Log để debug COD amount
    this.logger.debug(
      `[GHN Sync] Order ${order.orderCode} | paymentMethod: ${order.paymentMethod} | payment.method: ${(order as any).payment?.method} | payment.status: ${(order as any).payment?.status} | cod_amount: ${ghnData.cod_amount} | total: ${order.total}`
    );

    try {
      const result = await this.ghnService.createOrder(ghnData);
      const shippingCode = result.data.order_code;
      const actualGHNFee = result.data.total_fee || 0;

      // Update snapshot with GHN fee
      const newSnapshot = {
        ...(order.shippingSnapshot as any || {}),
        actualGHNFee: actualGHNFee
      };

      const updated = await this.repository.update(id, {
        shippingCode: shippingCode,
        shippingSnapshot: newSnapshot,
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
      const ghnErrorMessage = error.response?.data?.message || error.message;
      this.logger.error('Lỗi khi đồng bộ đơn sang GHN:', error.response?.data || error.message);
      
      // Bắt lỗi số điện thoại không hợp lệ từ GHN để hiển thị thông báo thân thiện hơn
      if (ghnErrorMessage.includes('master_data_validate_phone')) {
        throw new BadRequestException('Số điện thoại của khách hàng không hợp lệ theo quy định của GHN. Vui lòng cập nhật số điện thoại di động (10 số) trước khi tạo vận đơn.');
      }

      throw new BadRequestException('Không thể tạo vận đơn trên hệ thống GHN: ' + ghnErrorMessage);
    }
  }
}
