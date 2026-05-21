import { DEFAULT_SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from "@/features/orders/constants/order-status.constants";

/**
 * Calculate shipping fee based on subtotal
 */
export function calculateShippingFee(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_FEE;
}

/**
 * Calculate discount amount based on discount info
 */
export function calculateDiscountAmount(
  subtotal: number,
  discount: {
    discountType?: string;
    type?: string;
    discountValue?: number;
    value?: number;
    minOrderAmount?: number;
    minOrderValue?: number;
    maxDiscountAmount?: number;
    maxDiscount?: number;
  } | null
): number {
  if (!discount) return 0;

  const minOrder = Number(discount.minOrderAmount || discount.minOrderValue || 0);
  const maxDiscount = Number(discount.maxDiscountAmount || discount.maxDiscount || 0);
  const discountVal = Number(discount.discountValue || discount.value || 0);

  if (minOrder && subtotal < minOrder) return 0;

  let amount = 0;
  if (discount.discountType === "PERCENTAGE" || discount.type === "PERCENTAGE") {
    amount = Math.round((subtotal * discountVal) / 100);
  } else {
    amount = discountVal;
  }

  if (maxDiscount && amount > maxDiscount) amount = maxDiscount;
  return Math.min(amount, subtotal);
}

/**
 * Calculate order total
 */
export function calculateOrderTotal(
  subtotal: number,
  shippingFee: number,
  discountAmount: number
): number {
  return Math.max(0, subtotal + shippingFee - discountAmount);
}
