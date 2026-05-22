// ── Enums — synced with backend prisma schema ──

export enum Role {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
  WAREHOUSE = "WAREHOUSE",
  SALES = "SALES",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING = "PENDING",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURN_REQUESTED = "RETURN_REQUESTED",
  RETURNED = "RETURNED",
}

export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  VNPAY = "VNPAY",
  MOMO = "MOMO",
  PAYOS = "PAYOS",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export enum ReturnStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  RETURNING = "RETURNING",
  RECEIVED = "RECEIVED",
  COMPLETED = "COMPLETED",
}
