import { OrderStatus, PaymentStatus } from "@/types/enums";

export interface OrderStatusConfig {
  label: string;
  color: string;
  bg: string;
  dot: string;
  icon: React.ComponentType<any>;
}

export interface AdminOrderStatusConfig {
  label: string;
  class: string;
  icon: React.ComponentType<any>;
}

export interface CustomerOrderStatusConfig {
  label: string;
  cls: string;
}

export interface OrderFilterParams {
  status?: OrderStatus;
  paymentMethod?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export interface OrderCounts {
  ALL: number;
  PENDING: number;
  PROCESSING: number;
  SHIPPED: number;
  DELIVERED: number;
  CANCELLED: number;
  RETURN_REQUESTED: number;
  RETURNED: number;
}

export interface CreateOrderPayload {
  userId?: number;
  guestEmail?: string;
  guestPhone?: string;
  shippingAddress: string;
  paymentMethod: string;
  items: {
    variantId: string;
    quantity: number;
    price: number;
  }[];
  discountCode?: string;
  shippingFee?: number;
}
