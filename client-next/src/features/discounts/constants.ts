export const DISCOUNT_TYPES = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
} as const;

export const DISCOUNT_TYPE_LABELS = {
  [DISCOUNT_TYPES.PERCENTAGE]: "Phần trăm (%)",
  [DISCOUNT_TYPES.FIXED]: "Số tiền cố định (₫)",
} as const;

export type DiscountType = keyof typeof DISCOUNT_TYPES;
