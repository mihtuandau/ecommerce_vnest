"use client";

import React from "react";
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Download, 
  ShoppingCart, 
  AlertCircle,
  Printer 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { OrderStatus, ReturnStatus } from "@/types/enums";

interface GuestDetailHeaderProps {
  orderId: number;
  orderCode: string;
  createdAt: string;
  status: OrderStatus;
  isPaid: boolean;
  statusConfig: Record<string, { label: string; color: string; icon: any }>;
  onSuccess?: () => void;
  contact: string;
  deliveredAt?: string;
  onReorder?: () => void;
  onCancel?: () => void;
  onReturn?: () => void;
  onConfirmReturn?: () => void;
  returnStatus?: ReturnStatus;
  isUpdatingReturn?: boolean;
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
  contact,
  deliveredAt,
  onReorder,
  onCancel,
  onReturn,
  onConfirmReturn,
  returnStatus,
  isUpdatingReturn,
}: GuestDetailHeaderProps) {
  const router = useRouter();
  const [isReturnModalOpen, setIsReturnModalOpen] = React.useState(false);
  const [showPopover, setShowPopover] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
      <div className="flex items-center gap-5">
        <button
          onClick={() => router.push("/")}
          className="h-12 w-12 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-slate-50 transition-all shrink-0 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 tracking-tight">
              Đơn hàng <span className="text-primary">#{orderCode}</span>
            </h1>
            <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold border h-fit flex items-center gap-1.5 ${currentStatus.color}`}>
              <currentStatus.icon className="h-3.5 w-3.5" />
              {currentStatus.label}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[13px] text-slate-500 font-medium">
            <p>Ngày đặt: <span className="text-slate-900">{formatDate(createdAt)}</span></p>
            {status === OrderStatus.DELIVERED && deliveredAt && (
              <div className="flex items-center gap-2 text-emerald-600">
                <div className="h-1 w-1 rounded-full bg-emerald-500" />
                Giao lúc: {formatDate(deliveredAt)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {showConfirmReturn && (
          <div className="relative" ref={popoverRef}>
            <Button
              onClick={() => setShowPopover(!showPopover)}
              disabled={isUpdatingReturn}
              className="bg-primary hover:brightness-110 text-white text-xs font-semibold h-11 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/10 transition-all active:scale-95"
            >
              <Truck className="h-4 w-4" />
              Xác nhận đã gửi hàng
            </Button>

            {showPopover && (
              <div className="absolute bottom-full mb-3 right-0 w-[260px] bg-white border border-slate-100 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-sm text-slate-600 font-medium mb-4 leading-relaxed">
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
            className="bg-primary hover:brightness-110 text-white text-xs font-semibold h-11 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/10 transition-all active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
            Mua lại đơn này
          </Button>
        )}

        <Button
          variant="outline"
          className="border-slate-200 text-slate-600 text-xs font-semibold h-11 px-6 rounded-xl hover:bg-slate-50 transition-all active:scale-95"
          onClick={() => window.open('https://zalo.me/0987654321', '_blank')}
        >
          Liên hệ hỗ trợ
        </Button>

        <Button
          variant="outline"
          className="border-slate-200 text-slate-600 text-xs font-semibold h-11 px-6 rounded-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4" />
          In hóa đơn
        </Button>

        <Button
          variant="outline"
          className="border-slate-200 text-slate-600 text-xs font-semibold h-11 px-6 rounded-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2"
          onClick={() => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            window.location.href = `${apiUrl}/orders/guest/invoice/${orderCode}?contact=${contact}`;
          }}
        >
          <Download className="h-4 w-4" />
          Tải hóa đơn
        </Button>

        {status === OrderStatus.DELIVERED && !returnStatus && onReturn && (
          <Button
            variant="ghost"
            className="text-amber-600 hover:bg-amber-50 text-xs font-semibold h-11 px-6 rounded-xl flex items-center gap-2 transition-all active:scale-95"
            onClick={onReturn}
          >
            <AlertCircle className="h-4 w-4" />
            Yêu cầu trả hàng
          </Button>
        )}
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
