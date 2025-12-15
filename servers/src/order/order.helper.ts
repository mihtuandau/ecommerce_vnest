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
 */
export function calculateOrderTotal(
  items: Array<{quantity: number, price: number}>,
  shippingFee: number = 0,
  discount?: {percentage?: number, fixedAmount?: number}
) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxAmount = 0; // Remove VAT tax
  const total = totalItems + shippingFee; // Items + shipping
  
  // Apply discount to total (items + shipping)
  let discountedTotal = total;
  if (discount) {
    if (discount.percentage) {
      discountedTotal *= 1 - discount.percentage / 100;
    } else if (discount.fixedAmount) {
      discountedTotal -= discount.fixedAmount;
    }
  }
  
  return {
    totalItems,
    shippingFee,
    taxAmount,
    total,
    discountedTotal,
  };
}

/**
 * Validate discount code
 */
export function validateDiscount(discount: any) {
  if (!discount) {
    throw new BadRequestException('Mã giảm giá không tồn tại');
  }
  
  if (discount.endDate && discount.endDate < new Date()) {
    throw new BadRequestException('Mã giảm giá đã hết hạn');
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
  items: Array<{variantId: number, quantity: number, price: number}>,
  total: number,
  discount: any
) {
  const orderData: any = {
    orderCode,
    addressId: dto.addressId || null,
    shippingMethodId: dto.shippingMethodId || null,
    shippingAddress: dto.shippingAddress || null,
    shippingInfo: dto.shippingInfo || null,
    guestEmail: dto.guestEmail || null,
    guestPhone: dto.guestPhone || null,
    paymentMethod: (dto.paymentMethod as any) || 'CASH',
    total,
    taxAmount: 0,
    discountId: discount ? discount.id : null,
    status: 'PENDING',
    orderItems: {
      create: items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
      })),
    },
  };

  // Only add userId if user is logged in
  if (userId) {
    orderData.userId = userId;
  }

  return orderData;
}

/**
 * Prepare order details for email
 */
export function prepareOrderEmailDetails(order: any) {
  const customerEmail = order.guestEmail || order.user?.email;
  const customerName = order.shippingInfo?.['fullName'] || order.user?.name || 'Khách hàng';
  
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
      shippingAddress: order.shippingAddress || 'N/A',
    }
  };
}