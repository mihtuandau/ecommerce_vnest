import {
  BarChart3,
  CreditCard,
  Image,
  MessageCircle,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Users,
  Warehouse,
} from "lucide-react";
import React from "react";
import { Role } from "@/types/enums";

export const PERMISSION_GROUPS: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  user: { label: "Người dùng", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  product: {
    label: "Sản phẩm",
    icon: Package,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  category: {
    label: "Danh mục",
    icon: Tag,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  order: {
    label: "Đơn hàng",
    icon: ShoppingCart,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  inventory: {
    label: "Kho hàng",
    icon: Warehouse,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  report: {
    label: "Báo cáo",
    icon: BarChart3,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  chat: {
    label: "Chat",
    icon: MessageCircle,
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  discount: { label: "Khuyến mãi", icon: Tag, color: "text-red-600", bg: "bg-red-50" },
  banner: {
    label: "Banner",
    icon: Image,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  dashboard: {
    label: "Tổng quan",
    icon: BarChart3,
    color: "text-slate-600",
    bg: "bg-slate-50",
  },
  settings: {
    label: "Cài đặt",
    icon: Settings,
    color: "text-slate-600",
    bg: "bg-slate-50",
  },
  payment: {
    label: "Thanh toán",
    icon: CreditCard,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
};

export const ROLE_CONFIG: Record<
  Role,
  {
    label: string;
    desc: string;
    color: string;
    border: string;
    bg: string;
    icon: React.ElementType;
  }
> = {
  [Role.ADMIN]: {
    label: "Quản trị viên",
    desc: "Toàn quyền truy cập",
    color: "text-rose-600",
    border: "border-rose-200",
    bg: "bg-rose-50",
    icon: ShieldCheck,
  },
  [Role.WAREHOUSE]: {
    label: "Quản lý kho",
    desc: "Quản lý xuất nhập tồn",
    color: "text-amber-600",
    border: "border-amber-200",
    bg: "bg-amber-50",
    icon: Warehouse,
  },
  [Role.SALES]: {
    label: "Bán hàng",
    desc: "Xử lý đơn & khách hàng",
    color: "text-sky-600",
    border: "border-sky-200",
    bg: "bg-sky-50",
    icon: ShoppingCart,
  },
  [Role.CUSTOMER]: {
    label: "Khách hàng",
    desc: "Mua hàng & đánh giá",
    color: "text-slate-600",
    border: "border-slate-200",
    bg: "bg-slate-50",
    icon: Users,
  },
};

export const MANAGED_ROLES = [Role.ADMIN, Role.WAREHOUSE, Role.SALES, Role.CUSTOMER];

export const ACTION_LABELS: Record<string, string> = {
  manage: "Quản lý",
  view: "Xem",
  create: "Tạo",
  edit: "Sửa",
  delete: "Xóa",
  support: "Hỗ trợ",
};
