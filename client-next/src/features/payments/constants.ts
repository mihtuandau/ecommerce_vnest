export const PAYMENT_STATUS_CONFIG = {
  SUCCESS: {
    label: "Thành công",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  PENDING: {
    label: "Chờ xử lý",
    color: "bg-amber-50 text-amber-600 border-amber-200 animate-pulse",
  },
  FAILED: { label: "Thất bại", color: "bg-rose-50 text-rose-600 border-rose-200" },
  REFUNDED: {
    label: "Đã hoàn tiền",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  CANCELLED: { label: "Đã hủy", color: "bg-slate-100 text-slate-500 border-slate-200" },
} as const;

export const PAYMENT_METHOD_CONFIG = {
  CASH: { label: "COD", color: "text-slate-655", iconColor: "text-slate-450" },
  CARD: { label: "Thẻ CARD", color: "text-teal-650", iconColor: "text-teal-450" },
  VNPAY: { label: "VNPay", color: "text-sky-655", iconColor: "text-sky-450" },
  MOMO: { label: "MoMo", color: "text-pink-650", iconColor: "text-pink-400" },
  PAYOS: { label: "PayOS", color: "text-amber-650", iconColor: "text-amber-450" },
  BANK: {
    label: "Chuyển khoản",
    color: "text-indigo-650",
    iconColor: "text-indigo-450",
  },
} as const;
