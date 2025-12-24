
import { BadRequestException } from '@nestjs/common';
import { PayOSService } from '../payos/payos.service';

export function serializePayment(payment: any) {
  if (!payment) return null;
  return {
    ...payment,
    payosOrderCode: payment.payosOrderCode ? Number(payment.payosOrderCode) : null,
  };
}

export function generateTransactionId(method: string): string {
  if (method === 'PAYOS') {
    return Date.now().toString();
  }
  return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generatePayOSOrderCode(): number {
  return Date.now();
}

export async function createPayOSPaymentLink(payosService: PayOSService, order: any, orderCode: number) {
  const shippingInfo = order.shippingInfo as any;
  const buyerName = order.user?.name || shippingInfo?.fullName || order.address?.fullName || 'Customer';
  const buyerEmail = order.user?.email || order.guestEmail || '';
  const buyerPhone = shippingInfo?.phone || order.guestPhone || order.address?.phone || '';

  // Validate order items
  if (!order.orderItems || order.orderItems.length === 0) {
    throw new BadRequestException('Order has no items');
  }

  try {
    const payosResponse = await payosService.createPaymentLink({
      orderCode,
      amount: order.total,
      description: `Thanh toán đơn hàng #${order.id}`,
      buyerName,
      buyerEmail,
      buyerPhone,
      items: order.orderItems.map((item) => ({
        name: item.variant?.product?.name || 'Product',
        quantity: item.quantity,
        price: item.price,
      })),
    });

    return {
      paymentLink: payosResponse.checkoutUrl,
      transactionId: payosResponse.paymentLinkId,
    };
  } catch (error) {
    throw new BadRequestException(`Failed to create PayOS payment link: ${error.message}`);
  }
}

export function serializePayOSPaymentInfo(paymentInfo: any) {
  return {
    ...paymentInfo,
    orderCode: paymentInfo.orderCode ? Number(paymentInfo.orderCode) : paymentInfo.orderCode,
    amount: paymentInfo.amount ? Number(paymentInfo.amount) : paymentInfo.amount,
    amountPaid: paymentInfo.amountPaid ? Number(paymentInfo.amountPaid) : paymentInfo.amountPaid,
    amountRemaining: paymentInfo.amountRemaining ? Number(paymentInfo.amountRemaining) : paymentInfo.amountRemaining,
  };
}