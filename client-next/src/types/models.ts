// ── Domain models — synced with Prisma schema ──

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "CUSTOMER" | "ADMIN" | "KHO" | "BAN_HANG";
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  categoryId: string;
  category?: Category;
  stock: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  image?: string;
}

export interface Order {
  id: string;
  orderCode: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
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
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
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
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}
