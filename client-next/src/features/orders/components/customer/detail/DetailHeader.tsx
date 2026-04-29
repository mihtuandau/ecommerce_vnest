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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 pb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/orders")}
          className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#1565C1] hover:border-[#1565C1] hover:bg-blue-50 transition-all shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
              Đơn hàng #{orderCode}
            </h1>
            <span
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium border h-fit leading-none flex items-center justify-center ${currentStatus.color}`}
            >
              {currentStatus.label}
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Ngày đặt: {formatDate(createdAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap relative">
        {showConfirmReturn && (
          <div className="relative" ref={popoverRef}>
            <Button
              onClick={() => setShowPopover(!showPopover)}
              disabled={isUpdatingReturn}
              className="bg-[#1565C1] hover:bg-[#0d47a1] text-white text-xs font-semibold h-10 px-6 rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Truck className="h-4 w-4" />
              Xác nhận đã gửi hàng
            </Button>

            {showPopover && (
              <div className="absolute bottom-full mb-3 right-0 w-[240px] bg-white border border-slate-100 rounded-xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-[12px] text-slate-600 font-medium mb-3">
                  Bạn chắc chắn đã bàn giao gói hàng cho bưu cục?
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-[11px] font-semibold border-slate-100 text-slate-500 rounded-lg"
                    onClick={() => setShowPopover(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-[11px] font-bold bg-[#1565C1] hover:bg-[#0d47a1] text-white rounded-lg shadow-sm"
                    onClick={() => {
                      onConfirmReturn?.();
                      setShowPopover(false);
                    }}
                  >
                    Xác nhận
                  </Button>
                </div>
                {/* Arrow */}
                <div className="absolute top-full right-6 -mt-1 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45" />
              </div>
            )}
          </div>
        )}

        {[OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.RETURNED].includes(
          status
        ) &&
          !showConfirmReturn && (
            <Button
              onClick={onReorder}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-medium h-9 px-5 rounded-lg flex items-center gap-2"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Mua lại đơn này
            </Button>
          )}

        <Button
          variant="outline"
          className="border-slate-200 text-slate-600 text-xs font-medium h-9 px-4 rounded-lg"
        >
          Liên hệ hỗ trợ
        </Button>

        <Button
          variant="outline"
          className="border-slate-200 text-slate-600 text-xs font-medium h-9 px-4 rounded-lg flex items-center gap-2"
          onClick={() => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            window.location.href = `${apiUrl}/orders/${orderId}/invoice`;
          }}
        >
          <Download className="h-3.5 w-3.5" />
          Tải hóa đơn
        </Button>

        {!isCancelled && status === OrderStatus.PENDING && (
          <Button
            variant="ghost"
            className="text-rose-500 hover:bg-rose-50 text-xs font-medium h-9 px-4 rounded-lg"
            onClick={onCancel}
          >
            Hủy đơn
          </Button>
        )}
        {status === OrderStatus.DELIVERED && !returnStatus && onReturn && (
          <Button
            variant="ghost"
            className="text-amber-600 hover:bg-amber-50 text-xs font-medium h-9 px-4 rounded-lg flex items-center gap-2"
            onClick={onReturn}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            Yêu cầu trả hàng
          </Button>
        )}
      </div>
    </div>
  );
}
