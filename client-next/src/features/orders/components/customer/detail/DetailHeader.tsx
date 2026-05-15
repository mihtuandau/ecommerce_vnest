"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Truck,
  CheckCircle2,
  Download,
  AlertCircle,
  XCircle,
  Clock,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import { OrderStatus, ReturnStatus } from "@/types/enums";

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
  statusConfig: Record<string, { label: string; color: string; icon: any }>;
  deliveredAt?: string;
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
  orderId,
  createdAt,
  status,
  isPaid,
  isCancelled,
  onReorder,
  onCancel,
  onReturn,
  onConfirmReturn,
  returnStatus,
  isUpdatingReturn,
  statusConfig,
  deliveredAt,
}: DetailHeaderProps) {
  const router = useRouter();
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let currentStatus = statusConfig[status] || {
    label: status,
    color: "text-slate-500 bg-slate-50 border-slate-100",
    icon: Package,
  };

  if (status === OrderStatus.PENDING && isPaid) {
    currentStatus = {
      label: "Đã thanh toán",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      icon: CheckCircle2,
    };
  }

  const showConfirmReturn = returnStatus === ReturnStatus.APPROVED;

  return (
    <div className="space-y-6 mb-8">
      {/* Top row: Navigation and Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/orders")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all font-semibold text-sm shadow-sm"
        >
          <ArrowLeft size={16} />
          Đơn hàng của tôi
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            {currentStatus.label}
          </div>
          
          {status === OrderStatus.PENDING && !isCancelled && (
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all font-semibold text-sm shadow-sm"
            >
              <XCircle size={16} />
              Hủy đơn
            </button>
          )}
        </div>
      </div>

      {/* Title section */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Đơn hàng #{orderCode}
        </h1>
        <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
          <span>Đặt lúc {formatDate(createdAt)}</span>
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-tighter">COD</span>
        </div>
      </div>
    </div>
  );
}
