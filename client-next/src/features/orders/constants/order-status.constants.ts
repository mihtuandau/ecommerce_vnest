import { Clock, Package, Truck, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { OrderStatus } from "@/types/enums";

export const ORDER_STATUS_CONFIG = {
  [OrderStatus.PENDING]: {
    label: "Đang chờ LUXE xác nhận",
    color: "text-[#C49A00]",
    bg: "bg-[#FFF8E6]",
    dot: "bg-[#C49A00]",
    icon: Clock,
  },
  [OrderStatus.PROCESSING]: {
    label: "Đơn hàng đã được xác nhận",
    color: "text-[#2C5F8A]",
    bg: "bg-[#E8F0F8]",
    dot: "bg-[#2C5F8A]",
    icon: Package,
  },
  [OrderStatus.SHIPPED]: {
    label: "Đang được vận chuyển",
    color: "text-[#2C5F8A]",
    bg: "bg-[#E8F0F8]",
    dot: "bg-[#2C5F8A]",
    icon: Truck,
  },
  [OrderStatus.DELIVERED]: {
    label: "Giao hàng thành công",
    color: "text-[#3A7D5A]",
    bg: "bg-[#E6F3EC]",
    dot: "bg-[#3A7D5A]",
    icon: CheckCircle2,
  },
  [OrderStatus.CANCELLED]: {
    label: "Đã hủy đơn hàng",
    color: "text-[#C44040]",
    bg: "bg-[#FCEAEA]",
    dot: "bg-[#C44040]",
    icon: XCircle,
  },
  [OrderStatus.RETURN_REQUESTED]: {
    label: "Yêu cầu trả hàng",
    color: "text-[#C4783A]",
    bg: "bg-[#FFF2E6]",
    dot: "bg-[#C4783A]",
    icon: RotateCcw,
  },
  [OrderStatus.RETURNED]: {
    label: "Đã trả hàng",
    color: "text-[#3D2B1A]",
    bg: "bg-[#F3EFE8]",
    dot: "bg-[#3D2B1A]",
    icon: RotateCcw,
  },
} as const;

export const ADMIN_ORDER_STATUS_CONFIG = {
  [OrderStatus.PENDING]: {
    label: "Chờ xử lý",
    class: "bg-slate-100 text-slate-600 border-slate-200",
    icon: Clock,
  },
  [OrderStatus.PROCESSING]: {
    label: "Đang xử lý",
    class: "bg-blue-50 text-blue-600 border-blue-200",
    icon: Package,
  },
  [OrderStatus.SHIPPED]: {
    label: "Đang giao",
    class: "bg-indigo-50 text-indigo-600 border-indigo-200",
    icon: Truck,
  },
  [OrderStatus.DELIVERED]: {
    label: "Đã giao",
    class: "bg-emerald-50 text-emerald-600 border-emerald-200",
    icon: CheckCircle2,
  },
  [OrderStatus.CANCELLED]: {
    label: "Đã hủy",
    class: "bg-rose-50 text-rose-600 border-rose-200",
    icon: XCircle,
  },
  [OrderStatus.RETURN_REQUESTED]: {
    label: "Yêu cầu trả hàng",
    class: "bg-amber-50 text-amber-600 border-amber-200",
    icon: RotateCcw,
  },
  [OrderStatus.RETURNED]: {
    label: "Đã trả hàng",
    class: "bg-purple-50 text-purple-600 border-purple-200",
    icon: CheckCircle2,
  },
} as const;

export const CUSTOMER_ORDER_STATUS_CONFIG = {
  [OrderStatus.PENDING]: {
    label: "Chờ xác nhận",
    cls: "bg-[#FFF8E6] text-[#C49A00]",
  },
  [OrderStatus.PROCESSING]: {
    label: "Đã xác nhận",
    cls: "bg-[#E8F0F8] text-[#2C5F8A]",
  },
  [OrderStatus.SHIPPED]: {
    label: "Đang giao hàng",
    cls: "bg-[#F0D5BB] text-[#C4783A]",
  },
  [OrderStatus.DELIVERED]: {
    label: "Đã giao hàng",
    cls: "bg-[#E6F3EC] text-[#3A7D5A]",
  },
  [OrderStatus.CANCELLED]: {
    label: "Đã huỷ",
    cls: "bg-[#FCEAEA] text-[#C44040]",
  },
  [OrderStatus.RETURN_REQUESTED]: {
    label: "Yêu cầu trả hàng",
    cls: "bg-[#FFF8E6] text-[#C49A00]",
  },
  [OrderStatus.RETURNED]: {
    label: "Đã trả hàng",
    cls: "bg-[#E6F3EC] text-[#3A7D5A]",
  },
} as const;

export const DEFAULT_SHIPPING_FEE = 30000;
export const FREE_SHIPPING_THRESHOLD = 500000;

// Contact Information
export const ORDERS_CONTACT = {
  ZALO_BASE_URL: "https://zalo.me",
} as const;
