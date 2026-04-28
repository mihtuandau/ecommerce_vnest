"use client";

import React from "react";
import { ArrowLeft, Package, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@/types/enums";

interface GuestDetailHeaderProps {
  orderId: number;
  orderCode: string;
  createdAt: string;
  status: OrderStatus;
  isPaid: boolean;
  statusConfig: Record<string, { label: string; color: string; icon: any }>;
  onSuccess?: () => void;
  contact: string;
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

import { RequestReturnModal } from "../detail/RequestReturnModal";

export function GuestDetailHeader({ 
  orderId,
  orderCode, 
  createdAt, 
  status, 
  isPaid, 
  statusConfig,
  onSuccess,
  contact
}: GuestDetailHeaderProps) {
  const router = useRouter();
  const [isReturnModalOpen, setIsReturnModalOpen] = React.useState(false);
  
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

  const canReturn = status === OrderStatus.DELIVERED;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
      <div className="space-y-2">
        <button 
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Về trang chủ
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-slate-800">Đơn hàng #{orderCode}</h1>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border h-fit leading-none flex items-center justify-center ${currentStatus.color}`}>
            {currentStatus.label}
          </span>
        </div>
        <p className="text-sm text-slate-500">Ngày đặt: {formatDate(createdAt)}</p>
      </div>

      <div className="flex items-center gap-2">
        {canReturn && (
          <Button 
            onClick={() => setIsReturnModalOpen(true)}
            className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold h-9 px-5 rounded-lg shadow-lg shadow-rose-500/10"
          >
            Yêu cầu trả hàng
          </Button>
        )}
        <Button variant="outline" className="border-slate-200 text-slate-600 text-xs font-medium h-9 px-4 rounded-lg">
          Liên hệ hỗ trợ
        </Button>
      </div>

      <RequestReturnModal 
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        orderId={orderId}
        orderCode={orderCode}
        onSuccess={() => {
          onSuccess?.();
          setIsReturnModalOpen(false);
        }}
        isGuest={true}
        contact={contact}
      />
    </div>
  );
}
