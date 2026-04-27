import { OrderStatus } from "@/types/enums";

export const STATUS_MAP: Record<string, { label: string; color: string; bg: string; hex: string }> = {
  [OrderStatus.PENDING]: { label: "Chờ xử lý", color: "text-amber-600", bg: "bg-amber-500/10", hex: "#f59e0b" },
  [OrderStatus.PROCESSING]: { label: "Đang xử lý", color: "text-blue-600", bg: "bg-blue-500/10", hex: "#3b82f6" },
  [OrderStatus.SHIPPED]: { label: "Đang giao", color: "text-indigo-600", bg: "bg-indigo-500/10", hex: "#6366f1" },
  [OrderStatus.DELIVERED]: { label: "Đã giao", color: "text-emerald-600", bg: "bg-emerald-500/10", hex: "#10b981" },
  [OrderStatus.CANCELLED]: { label: "Đã hủy", color: "text-destructive", bg: "bg-destructive/10", hex: "#ef4444" },
  [OrderStatus.RETURN_REQUESTED]: { label: "Trả hàng", color: "text-amber-600", bg: "bg-amber-500/10", hex: "#f59e0b" },
  [OrderStatus.RETURNED]: { label: "Đã trả", color: "text-purple-600", bg: "bg-purple-500/10", hex: "#a855f7" },
  AWAITING_PAYMENT: { label: "Chờ thanh toán", color: "text-slate-600", bg: "bg-slate-500/10", hex: "#64748b" },
};
