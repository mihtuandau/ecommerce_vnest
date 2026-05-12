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
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
      <div className="flex items-start gap-5">
        <button
          onClick={() => router.push("/orders")}
          className="h-10 w-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-slate-50 transition-all shrink-0 group mt-1"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
              Đơn hàng <span className="text-primary font-bold">#{orderCode}</span>
            </h1>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold border h-fit flex items-center gap-1.5 uppercase tracking-widest ${currentStatus.color}`}>
              <currentStatus.icon className="h-3 w-3" />
              {currentStatus.label}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-6 text-[13px] text-slate-500 font-medium">
            <p>Ngày đặt: <span className="text-slate-900 font-bold">{formatDate(createdAt)}</span></p>
            {status === OrderStatus.DELIVERED && deliveredAt && (
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <div className="h-1 w-1 rounded-full bg-emerald-500" />
                Giao lúc: {formatDate(deliveredAt)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="flex flex-wrap items-center justify-end gap-2">
          {showConfirmReturn && (
            <div className="relative" ref={popoverRef}>
              <Button
                onClick={() => setShowPopover(!showPopover)}
                disabled={isUpdatingReturn}
                className="bg-primary hover:brightness-110 text-white text-[11px] font-bold h-10 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/10 transition-all active:scale-95 uppercase tracking-widest"
              >
                {isUpdatingReturn ? <Spinner size="sm" variant="white" /> : <Truck className="h-3.5 w-3.5" />}
                Xác nhận đã gửi hàng
              </Button>

              {showPopover && (
                <div className="absolute bottom-full mb-3 right-0 w-[260px] bg-white border border-slate-100 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-sm text-slate-600 font-medium mb-4 leading-relaxed text-left">
                    Bạn chắc chắn đã bàn giao gói hàng cho bưu cục?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 text-xs font-semibold border-slate-100 text-slate-400 rounded-xl hover:bg-slate-50"
                      onClick={() => setShowPopover(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 h-9 text-xs font-bold bg-primary hover:brightness-110 text-white rounded-xl shadow-sm"
                      onClick={() => {
                        onConfirmReturn?.();
                        setShowPopover(false);
                      }}
                    >
                      Xác nhận
                    </Button>
                  </div>
                  <div className="absolute top-full right-8 -mt-1 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45" />
                </div>
              )}
            </div>
          )}

          {[OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.RETURNED].includes(status) && !showConfirmReturn && (
            <Button
              onClick={onReorder}
              className="bg-primary hover:brightness-110 text-white text-[11px] font-bold h-10 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/10 transition-all active:scale-95 uppercase tracking-widest"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Mua lại
            </Button>
          )}

          <Button
            variant="outline"
            className="border-slate-200 text-slate-500 text-[11px] font-bold h-10 px-5 rounded-xl hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest"
            onClick={() => window.open('https://zalo.me/0987654321', '_blank')}
          >
            Hỗ trợ
          </Button>

          <Button
            variant="outline"
            className="border-slate-200 text-slate-500 text-[11px] font-bold h-10 px-5 rounded-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest"
            onClick={() => {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
              window.location.href = `${apiUrl}/orders/${orderId}/invoice`;
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Hóa đơn
          </Button>
        </div>

        {status === OrderStatus.PENDING && !isCancelled && (
          <Button
            variant="ghost"
            size="sm"
            className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 text-[11px] font-bold px-4 h-8 rounded-lg transition-all active:scale-95 uppercase tracking-widest"
            onClick={onCancel}
          >
            Hủy đơn hàng
          </Button>
        )}

        {status === OrderStatus.DELIVERED && !returnStatus && onReturn && (
          <Button
            variant="ghost"
            className="text-amber-600 hover:bg-amber-50 text-[11px] font-bold h-8 px-4 rounded-lg flex items-center gap-2 transition-all active:scale-95 uppercase tracking-widest"
            onClick={onReturn}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            Trả hàng
          </Button>
        )}
      </div>
    </div>
  );
}
