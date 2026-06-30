import type { CheckoutDiscount } from "@/features/cart/store/cart.store";

export function calculateCartDiscountAmount(
  discount: CheckoutDiscount | null,
  total: number
) {
  if (!discount) return 0;

  const isPercentage = discount.discountType === "PERCENTAGE" || !!discount.percentage;
  const value = discount.discountValue || discount.percentage || discount.fixedAmount || 0;
  const rawSaving = isPercentage ? Math.round((total * value) / 100) : value;
  const cappedSaving =
    discount.maxDiscountAmount && rawSaving > discount.maxDiscountAmount
      ? discount.maxDiscountAmount
      : rawSaving;

  return Math.min(cappedSaving, total);
}

export function isCartDiscountApplicable(
  discount: CheckoutDiscount | null,
  total: number
) {
  return !discount?.minOrderAmount || total >= discount.minOrderAmount;
}
