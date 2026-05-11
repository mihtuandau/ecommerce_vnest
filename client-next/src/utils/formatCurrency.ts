/**
 * Format a number as Vietnamese Dong currency.
 * @example formatCurrency(150000) => "150.000₫"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}
