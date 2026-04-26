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
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  image?: string;
  products?: Product[];
}

export interface Order {
  id: string;
  orderCode: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  originalPrice?: number | null;
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

export interface Review {
  id: string;
  userId: string;
  user?: Pick<User, "id" | "name" | "avatar">;
  productId: string;
  orderId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  image: string;
  imageUrl?: string;
  link?: string;
  order: number;
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
}
