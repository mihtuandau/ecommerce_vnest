import { formatCurrency } from "@/utils/formatCurrency";
import dayjs from "@/lib/dayjs";

/**
 * Format order code for display (e.g. "#ORD-1234")
 */
export function formatOrderCode(code: string): string {
  return `#${code}`;
}

/**
 * Format order date for display
 */
export function formatOrderDate(date: string | Date): string {
  return dayjs(date).format("DD/MM/YYYY HH:mm");
}

/**
 * Format order total for display
 */
export function formatOrderTotal(total: number): string {
  return formatCurrency(total);
}

/**
 * Get readable payment method label
 */
export function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    COD: "Thanh toán khi nhận hàng",
    CASH: "Tiền mặt",
    VNPAY: "VNPay",
    MOMO: "MoMo",
    BANK_TRANSFER: "Chuyển khoản",
  };
  return labels[method] || method;
}
