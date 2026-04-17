// src/order/order.helper.ts
import { BadRequestException } from '@nestjs/common';

/**
 * Pure utility functions for order operations
 * No dependency injection - just pure functions
 */

/**
 * Helper to serialize order (convert BigInt in payment to Number)
 */
export function serializeOrder(order: any) {
  if (!order) return null;
  
  // If order has payment relation, serialize payment BigInt fields
  if (order.payment) {
    return {
      ...order,
      payment: {
        ...order.payment,
        payosOrderCode: order.payment.payosOrderCode 
          ? Number(order.payment.payosOrderCode) 
          : null,
      },
    };
  }
  
  return order;
}

/**
 * Generate unique order code
 */
export async function generateOrderCode(checkExistsFn: (code: string) => Promise<any>): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  // Generate format: ORD-XXXXXX (ORD + 6 random chars)
  code = 'ORD-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Check if code exists
  const existing = await checkExistsFn(code);
  
  // Recursively generate new code if exists
  if (existing) {
    return generateOrderCode(checkExistsFn);
  }
  
  return code;
}

/**
 * Calculate order totals with discount
 * - Discount chỉ áp trên subtotal (items), không giảm phí ship
 * - Có cap bởi maxDiscountAmount nếu được set
 */
export function calculateOrderTotal(
  items: Array<{quantity: number, price: number}>,
  shippingFee: number = 30000,
  discount?: {percentage?: number, fixedAmount?: number, maxDiscountAmount?: number}
) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxAmount = 0;

  // Tính số tiền được giảm (chỉ áp trên subtotal, không bao gồm ship)
  let discountAmount = 0;
  if (discount) {
    if (discount.percentage) {
      discountAmount = Math.round(totalItems * discount.percentage / 100);
    } else if (discount.fixedAmount) {
      discountAmount = discount.fixedAmount;
    }
    // Cap bởi maxDiscountAmount (nếu có)
    if (discount.maxDiscountAmount && discountAmount > discount.maxDiscountAmount) {
      discountAmount = discount.maxDiscountAmount;
    }
    // Không được giảm nhiều hơn chính subtotal
    discountAmount = Math.min(discountAmount, totalItems);
  }

  const total = totalItems + shippingFee;
  const discountedTotal = total - discountAmount;

  return {
    totalItems, // subtotal
    shippingFee,
    taxAmount,
    discountAmount,
    total, // original total including shipping
    discountedTotal, // final total after discount
  };
}

/**
 * Validate discount code
 * @param discount - discount record from DB
 * @param subtotal - optional items subtotal (không bao gồm phí ship) để check minOrderAmount
 */
export function validateDiscount(discount: any, subtotal?: number, currentUsageCount?: number) {
  if (!discount) {
    throw new BadRequestException('Mã giảm giá không tồn tại');
  }

  if (!discount.isActive) {
    throw new BadRequestException('Mã giảm giá đã bị vô hiệu hóa');
  }

  const now = new Date();

  if (discount.startDate && discount.startDate > now) {
    throw new BadRequestException(
      `Mã giảm giá chưa có hiệu lực (từ ${new Date(discount.startDate).toLocaleDateString('vi-VN')})`,
    );
  }

  if (discount.endDate && discount.endDate < now) {
    throw new BadRequestException('Mã giảm giá đã hết hạn');
  }

  if (subtotal !== undefined && discount.minOrderAmount && subtotal < discount.minOrderAmount) {
    throw new BadRequestException(
      `Đơn hàng tối thiểu ${discount.minOrderAmount.toLocaleString('vi-VN')}đ để sử dụng mã này`,
    );
  }

  if (
    discount.usageLimit &&
    currentUsageCount !== undefined &&
    currentUsageCount >= discount.usageLimit
  ) {
    throw new BadRequestException('Mã giảm giá đã đạt giới hạn số lần sử dụng');
  }

  return true;
}

/**
 * Prepare order data for database
 */
export function prepareOrderData(
  orderCode: string,
  userId: number | null,
  dto: any,
  items: Array<{variantId: number, quantity: number, price: number, productName?: string}>,
  totals: { subtotal: number, discountAmount: number, total: number },
  discount: any
) {
  const orderData: any = {
    orderCode,
    shippingSnapshot: {
      addressString: dto.shippingAddress || null,
      ...(dto.shippingInfo || {}),
    },
    guestEmail: dto.guestEmail || null,
    guestPhone: dto.guestPhone || null,
    subtotal: totals.subtotal,
    discountAmount: totals.discountAmount,
    total: totals.total,
    taxAmount: 0,
    status: 'PENDING',
    orderItems: {
      create: items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        productName: item.productName || 'Sản phẩm',
      })),
    },
  };

  // Connect relations instead of direct IDs
  if (userId) {
    orderData.user = { connect: { id: userId } };
  }

  if (dto.addressId) {
    orderData.address = { connect: { id: dto.addressId } };
  }

  if (dto.shippingMethodId) {
    orderData.shippingMethod = { connect: { id: dto.shippingMethodId } };
  }

  if (discount) {
    orderData.discount = { connect: { id: discount.id } };
  }

  return orderData;
}

/**
 * Prepare order details for email
 */
export function prepareOrderEmailDetails(order: any) {
  const customerEmail = order.guestEmail || order.user?.email;
  const shipping = order.shippingSnapshot as any;
  const customerName = shipping?.fullName || order.user?.name || 'Khách hàng';
  
  return {
    customerEmail,
    customerName,
    orderDetails: {
      customerName,
      items: order.orderItems.map(item => ({
        productName: item.variant?.product?.name || 'N/A',
        size: item.variant?.size,
        color: item.variant?.color,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total,
      shippingAddress: shipping?.addressString || 'N/A',
    }
  };
}