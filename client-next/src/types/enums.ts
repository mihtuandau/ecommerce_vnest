// ── Enums — synced with backend ──

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
}

export enum PaymentMethod {
  COD = "COD",
  VNPAY = "VNPAY",
  MOMO = "MOMO",
  PAYOS = "PAYOS",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}
