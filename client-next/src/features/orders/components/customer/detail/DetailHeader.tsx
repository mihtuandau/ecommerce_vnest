"use client";

import React from "react";
import { ArrowLeft, ShoppingCart, Package, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@/types/enums";

interface DetailHeaderProps {
  orderCode: string;
  createdAt: string;
  status: OrderStatus;
  isPaid: boolean;
  isCancelled: boolean;
  onReorder: () => void;
  onCancel: () => void;
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
  createdAt, 
  status, 
  isPaid, 
  isCancelled, 
  onReorder, 
  onCancel,
  statusConfig 
}: DetailHeaderProps) {
  const router = useRouter();
  
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

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 pb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/orders")}
          className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#1565C1] hover:border-[#1565C1] hover:bg-blue-50 transition-all shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Đơn hàng #{orderCode}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${currentStatus.color}`}
            >
              {currentStatus.label}
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Ngày đặt: {formatDate(createdAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onReorder}
          className="bg-primary hover:bg-primary/90 text-white text-xs font-medium h-9 px-5 rounded-lg flex items-center gap-2"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Mua lại đơn này
        </Button>
        <Button
          variant="outline"
          className="border-slate-200 text-slate-600 text-xs font-medium h-9 px-4 rounded-lg"
        >
          Liên hệ hỗ trợ
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
      </div>
    </div>
  );
}
