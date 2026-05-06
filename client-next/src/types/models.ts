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

export interface ProductImage {
  id: string;
  url: string;
  isMain?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  price?: number; 
  originalPrice?: number | null;
  images: ProductImage[] | string[];
  categoryId: string;
  category?: Category;
  brandId?: string;
  brand?: Brand;
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
  averageRating?: number; // Add for consistency
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
  images?: ProductImage[] | string[];
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

export interface Payment {
  id: number;
  orderId: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transactionId?: string;
  paymentLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  orderCode: string;
  userId: number | null;
  user?: Pick<User, "id" | "name" | "email">;
  orderItems: OrderItem[];
  subtotal: number;
  total: number;
  discountAmount: number;
  shippingFee: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddressId?: number;
  address?: Address;
  shippingSnapshot?: {
    fullName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street: string;
  };
  note?: string;
  payment?: Payment;
  reviews?: Review[];
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
  variantSnapshot?: {
    productName: string;
    size?: string;
    color?: string;
    imageUrl?: string;
  };
  returnItems?: any[]; // Keep any for now as return system is complex
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
