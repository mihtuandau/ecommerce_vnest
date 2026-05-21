import type { Order } from "@/types/models";
import { OrderStatus } from "@/types/enums";
import type { OrderFilterParams } from "../types/order.types";

/**
 * Filter orders based on filter params
 */
export function filterOrders(orders: Order[], params: OrderFilterParams): Order[] {
  let result = orders;

  if (params.status && params.status !== ("ALL" as any)) {
    result = result.filter((o) => o.status === params.status);
  }

  if (params.paymentMethod && params.paymentMethod !== "ALL") {
    result = result.filter((o) => o.paymentMethod === params.paymentMethod);
  }

  if (params.startDate) {
    const start = new Date(params.startDate);
    start.setHours(0, 0, 0, 0);
    result = result.filter((o) => new Date(o.createdAt) >= start);
  }

  if (params.endDate) {
    const end = new Date(params.endDate);
    end.setHours(23, 59, 59, 999);
    result = result.filter((o) => new Date(o.createdAt) <= end);
  }

  if (params.search) {
    const lowerSearch = params.search.toLowerCase();
    result = result.filter(
      (o) =>
        o.orderCode?.toLowerCase().includes(lowerSearch) ||
        (o as any).shippingSnapshot?.fullName?.toLowerCase().includes(lowerSearch) ||
        (o as any).user?.name?.toLowerCase().includes(lowerSearch) ||
        (o as any).guestPhone?.includes(params.search!) ||
        (o as any).shippingSnapshot?.phone?.includes(params.search!)
    );
  }

  return result;
}

/**
 * Count orders by status
 */
export function countOrdersByStatus(orders: Order[]): Record<string, number> {
  return {
    ALL: orders.length,
    PENDING: orders.filter((o) => o.status === OrderStatus.PENDING).length,
    PROCESSING: orders.filter((o) => o.status === OrderStatus.PROCESSING).length,
    SHIPPED: orders.filter((o) => o.status === OrderStatus.SHIPPED).length,
    DELIVERED: orders.filter((o) => o.status === OrderStatus.DELIVERED).length,
    CANCELLED: orders.filter((o) => o.status === OrderStatus.CANCELLED).length,
    RETURN_REQUESTED: orders.filter((o) => o.status === OrderStatus.RETURN_REQUESTED).length,
    RETURNED: orders.filter((o) => o.status === OrderStatus.RETURNED).length,
  };
}
