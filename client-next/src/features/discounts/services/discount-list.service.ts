import type { Discount } from "@/types/models";

export interface DiscountStatsSummary {
  total: number;
  active: number;
  flashSale: number;
  expired: number;
}

export function normalizeDiscountList(data: unknown): Discount[] {
  if (Array.isArray(data)) return data as Discount[];
  return ((data as any)?.data || []) as Discount[];
}

export function getDiscountStats(discounts: Discount[]): DiscountStatsSummary {
  const now = new Date();

  return {
    total: discounts.length,
    active: discounts.filter(
      (discount) =>
        discount.isActive &&
        (!discount.endDate || new Date(discount.endDate) > now)
    ).length,
    flashSale: discounts.filter((discount) => discount.isFlashSale).length,
    expired: discounts.filter(
      (discount) => discount.endDate && new Date(discount.endDate) < now
    ).length,
  };
}
