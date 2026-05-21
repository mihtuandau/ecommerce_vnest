import type { Order } from "@/types/models";

/**
 * Map order create payload to API format
 */
export function mapOrderCreatePayload(values: any): any {
  const cleanItems = (values.items || []).map((item: any) => ({
    variantId: item.variantId,
    quantity: item.quantity,
    price: item.price,
  }));

  return { ...values, items: cleanItems };
}

/**
 * Map order for print invoice
 */
export function mapOrderForInvoice(order: Order) {
  return {
    orderCode: order.orderCode,
    createdAt: order.createdAt,
    items: order.orderItems,
    total: order.total,
    shippingFee: order.shippingFee,
    discountAmount: order.discountAmount,
    paymentMethod: order.paymentMethod,
    shippingSnapshot: order.shippingSnapshot,
  };
}
