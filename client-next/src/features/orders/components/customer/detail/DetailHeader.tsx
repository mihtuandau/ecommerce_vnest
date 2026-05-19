"use client";

import React from "react";
import {
  ArrowLeft,
  XCircle,
  Calendar,
  Package,
  CreditCard,
  Printer,
  MapPin,
  X,
  Truck,
  ShoppingBag,
  RotateCcw,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { OrderStatus, ReturnStatus } from "@/types/enums";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";
import { CUSTOMER_ORDER_STATUS_CONFIG } from "../../../constants";

interface DetailHeaderProps {
  orderCode: string;
  orderId: number;
  createdAt: string;
  status: OrderStatus;
  isPaid: boolean;
  isCancelled: boolean;
  onReorder: () => void;
  onCancel: () => void;
  onReturn?: () => void;
  onConfirmReturn?: () => void;
  returnStatus?: ReturnStatus;
  isUpdatingReturn?: boolean;
  statusConfig: Record<
    string,
    { label: string; color: string; bg: string; dot: string; icon: any }
  >;
  deliveredAt?: string;
  isReviewed?: boolean;
  onReview?: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function DetailHeader({
  orderCode,
  createdAt,
  status,
  isPaid,
  isCancelled,
  onReorder,
  onCancel,
  onReturn,
  onReview,
  returnStatus,
  order,
  isReviewed,
}: DetailHeaderProps & { order?: any }) {
  const totalItems = order?.orderItems?.length || 0;

  const sc = CUSTOMER_ORDER_STATUS_CONFIG[status] || {
    label: status,
    cls: "bg-[#F3EFE8] text-[#8A7966]",
  };

  return (
    <div className="space-y-5 mb-5 font-sans-brand animate-in fade-in slide-in-from-top-4 duration-500">

      <div className="bg-white border border-[#DDD6C8] rounded-2xl p-6 flex flex-wrap items-start justify-between gap-5 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#3D2B1A] font-serif-brand tracking-tight">
              Đơn hàng{" "}
              <em className="italic text-[#C4783A] font-medium font-serif-brand not-italic">
                #{orderCode}
              </em>
            </h1>
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-bold",
                sc.cls
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {sc.label}
            </div>
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-bold",
                isPaid ? "bg-[#E6F3EC] text-[#3A7D5A]" : "bg-[#FCEAEA] text-[#C44040]"
              )}
            >
              {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-[#8A7966]">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="opacity-70" /> Đặt lúc{" "}
              <strong className="text-[#3D2B1A] font-semibold">
                {formatDate(createdAt)}
              </strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Package size={13} className="opacity-70" />{" "}
              <strong className="text-[#3D2B1A] font-semibold">
                {totalItems} sản phẩm
              </strong>
            </span>
            <span className="flex items-center gap-1.5">
              <ShoppingBag size={13} className="opacity-70" /> Phương thức:{" "}
              <strong className="text-[#3D2B1A] font-semibold">
                {order?.paymentMethod || "COD"}
              </strong>
            </span>
            {order?.shippingCode && (
              <span className="flex items-center gap-1.5">
                <Truck size={13} className="opacity-70" />{" "}
                <strong>{order.shippingCode}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-start">
          <button
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border-1.5 border-[#DDD6C8] bg-white text-[13px] font-medium text-[#3D2B1A] transition-all hover:bg-[#F3EFE8] hover:border-[#C4B49A]"
            onClick={() => window.print()}
          >
            <Printer size={14} />
            In đơn
          </button>

          {status === OrderStatus.PENDING && !isCancelled && (
            <button
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border-1.5 border-[#F0C0C0] bg-white text-[13px] font-medium text-[#C44040] transition-all hover:bg-[#FCEAEA] hover:border-[#C44040]"
              onClick={onCancel}
            >
              <X size={14} />
              Yêu cầu huỷ
            </button>
          )}

          {status === OrderStatus.SHIPPED && (
            <button className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border-1.5 border-[#DDD6C8] bg-white text-[13px] font-medium text-[#3D2B1A] transition-all hover:bg-[#F3EFE8] hover:border-[#C4B49A]">
              <MapPin size={14} />
              Theo dõi GHN
            </button>
          )}

          {status === OrderStatus.DELIVERED && !returnStatus && (
            <button
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border-1.5 border-[#DDD6C8] bg-white text-[13px] font-medium text-[#3D2B1A] transition-all hover:bg-[#F3EFE8] hover:border-[#C4B49A]"
              onClick={onReturn}
            >
              <RotateCcw size={14} />
              Trả hàng
            </button>
          )}

          {status === OrderStatus.DELIVERED && !isReviewed && (
            <button
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border-1.5 border-[#C49A00] bg-[#FFF8E6] text-[13px] font-bold text-[#C49A00] transition-all hover:bg-[#FFF2CC]"
              onClick={() => onReview?.()}
            >
              <Star size={14} fill="currentColor" />
              Đánh giá đơn hàng
            </button>
          )}
          <button
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-[#3D2B1A] text-[13px] font-medium text-white transition-all hover:bg-[#2A2420]"
            onClick={onReorder}
          >
            <ShoppingBag size={14} />
            Mua lại
          </button>
        </div>
      </div>
    </div>
  );
}
