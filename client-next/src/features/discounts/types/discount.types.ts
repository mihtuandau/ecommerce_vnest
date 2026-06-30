import type { CheckoutDiscount } from "@/features/cart/store/cart.store";
import type { Product } from "@/types/models";

export interface DiscountValidationResponse {
  isValid: boolean;
  message?: string;
  discount?: CheckoutDiscount;
}

export interface FlashSaleProduct extends Omit<Partial<Product>, "category"> {
  product?: Product;
  productId?: number | string;
  percentage?: number | null;
  fixedAmount?: number | null;
  stockLimit?: number;
  soldCount?: number;
  sold?: number;
  totalStock?: number;
  category?: {
    id?: number;
    name?: string;
  };
}

export interface FlashSaleSession {
  id: string;
  title?: string;
  description?: string;
  percentage?: number;
  fixedAmount?: number;
  startDate: string;
  endDate?: string;
  products: FlashSaleProduct[];
}
