import { OrderStatus } from "@/types/enums";
import {
  ORDER_STATUS_CONFIG,
  ADMIN_ORDER_STATUS_CONFIG,
  CUSTOMER_ORDER_STATUS_CONFIG,
} from "@/features/orders/constants/order-status.constants";

/**
 * Get order status label for customer-facing display
 */
export function getCustomerStatusLabel(status: string): string {
  if (status === "ALL") return "Tất cả";
  return CUSTOMER_ORDER_STATUS_CONFIG[status as OrderStatus]?.label || status;
}

/**
 * Get order status CSS class for customer-facing display
 */
export function getCustomerStatusStyle(status: string): string {
  return CUSTOMER_ORDER_STATUS_CONFIG[status as OrderStatus]?.cls || "bg-brand-ivory text-brand-taupe";
}

/**
 * Get admin status config
 */
export function getAdminStatusConfig(status: OrderStatus) {
  return ADMIN_ORDER_STATUS_CONFIG[status];
}

/**
 * Get order status config
 */
export function getOrderStatusConfig(status: OrderStatus) {
  return ORDER_STATUS_CONFIG[status];
}

/**
 * Check if order can be cancelled
 */
export function canCancelOrder(status: OrderStatus): boolean {
  return status === OrderStatus.PENDING || status === OrderStatus.PROCESSING;
}

/**
 * Check if order can be returned
 */
export function canReturnOrder(status: OrderStatus): boolean {
  return status === OrderStatus.DELIVERED;
}

/**
 * Check if order is in terminal state
 */
export function isTerminalStatus(status: OrderStatus): boolean {
  return [OrderStatus.CANCELLED, OrderStatus.RETURNED].includes(status);
}
