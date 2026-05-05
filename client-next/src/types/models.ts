import { Role, UserStatus, OrderStatus, PaymentMethod, PaymentStatus, DiscountType } from "./enums";

// ── Domain models — synced with Prisma schema ──

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: Role;
  status: UserStatus;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  price?: number; 
  originalPrice?: number | null;
  images: any[];
  categoryId: string;
  category?: Category;
  brandId?: string;
  brand?: any;
  variants?: ProductVariant[];
  stock: number;
  rating: number;
  reviewCount: number;
  soldCount?: number;
  viewCount?: number;
  isActive: boolean;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size?: string;
  color?: string;
  sku?: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  isActive: boolean;
  images?: any[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  image?: string;
  displayOrder?: number;
  products?: Product[];
}

export interface Order {
  id: number;
  orderCode: string;
  userId: number | null;
  orderItems: OrderItem[];
  subtotal: number;
  total: number;
  discountAmount: number;
  shippingFee: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddressId?: number;
  address?: Address;
  shippingSnapshot?: any;
  note?: string;
  payment?: any; // Simple any for now to fix errors
  reviews?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  variantId: number;
  quantity: number;
  price: number;
  variant?: ProductVariant;
  productName?: string;
  variantSnapshot?: any;
  returnItems?: any[];
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  province?: string;
  district?: string;
  city?: string;
  state?: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

export interface ReviewImage {
  id: number;
  reviewId: number;
  url: string;
}

export interface Review {
  id: string;
  userId: string;
  user?: Pick<User, "id" | "name" | "avatar">;
  productId: string;
  orderId: string;
  rating: number;
  comment: string;
  images?: ReviewImage[];
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  image: string;
  imageUrl?: string;
  link?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Discount {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isFlashSale?: boolean;
}
