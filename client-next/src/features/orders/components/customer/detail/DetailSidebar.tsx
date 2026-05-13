"use client";

import React from "react";
import { 
  MapPin, 
  CreditCard, 
  Phone, 
  User as UserIcon,
  Store,
  Star,
  MessageCircle,
  RotateCcw,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { OrderStatus, PaymentStatus } from "@/types/enums";
import { useToast } from "@/hooks/useToast";
import { paymentsApi } from "@/features/payments/api";
import { User } from "@/types/models";
import { cn } from "@/utils/cn";

interface DetailSidebarProps {
  orderId: number;
  shippingSnapshot: {
    fullName?: string;
    phone?: string;
    addressString?: string;
    street?: string;
    ward?: string;
    district?: string;
    province?: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  addressRelation?: any;
  paymentMethod: string;
  paymentStatus: string;
  isPaid: boolean;
  isCancelled: boolean;
  isReturned?: boolean;
  isReturning?: boolean;
  shippingCode?: string;
  status?: OrderStatus;
  onReturn?: () => void;
  onReport?: () => void;
  onReview?: () => void;
  isReviewed?: boolean;
  orderItems?: any[];
}

export function DetailSidebar({ 
  orderId,
  shippingSnapshot, 
  user, 
  addressRelation,  
  paymentMethod, 
  paymentStatus, 
  isPaid, 
  isCancelled, 
  isReturned,
  isReturning,
  shippingCode,
  status,
  onReturn,
  onReport,
  onReview,
  isReviewed
}: DetailSidebarProps) {
  const [isPaying, setIsPaying] = React.useState(false);
  const router = useRouter();
  const { error } = useToast();

  const handlePayNow = async () => {
    if (isPaying) return;
    setIsPaying(true);
    try {
      const res = await paymentsApi.createPayment(orderId, paymentMethod);
      if (res.paymentLink) {
        window.location.href = res.paymentLink;
      } else {
        throw new Error("Không tìm thấy liên kết thanh toán");
      }
    } catch (err: { message?: string } | any) {
      error(err.message || "Không thể khởi tạo thanh toán. Vui lòng thử lại sau.");
    } finally {
      setIsPaying(false);
    }
  };

  const address = shippingSnapshot?.addressString || 
    [
      shippingSnapshot?.street, 
      shippingSnapshot?.ward, 
      shippingSnapshot?.district, 
      shippingSnapshot?.province
    ].filter(Boolean).join(", ") || 
    (typeof addressRelation === 'object' ? 
      [addressRelation?.street, addressRelation?.ward, addressRelation?.district, addressRelation?.province || addressRelation?.city].filter(Boolean).join(", ") 
      : addressRelation) || "—";

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      {/* Người nhận */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <UserIcon size={16} className="text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">Người nhận</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
              <UserIcon size={14} />
            </div>
            <p className="text-sm font-bold text-slate-900">{shippingSnapshot?.fullName || user?.name || "Nguyễn Văn An"}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
              <Phone size={14} />
            </div>
            <p className="text-sm font-bold text-slate-900">{shippingSnapshot?.phone || user?.phone || "0912 345 678"}</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
              <MapPin size={14} />
            </div>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">{address}</p>
          </div>
        </div>
      </div>

      {/* Thông tin thanh toán & Vận chuyển */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
            <CreditCard size={16} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">Thông tin thanh toán</h3>
        </div>
        
        <div className="space-y-4 pt-1">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-slate-500">Phương thức</span>
            <span className="text-slate-900">{paymentMethod || "Tiền mặt (COD)"}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-slate-500">Trạng thái</span>
            <div className={cn(
              "px-3 py-0.5 rounded-md text-[10px] font-bold border",
              isPaid ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-amber-600 bg-amber-50 border-amber-100"
            )}>
              {isPaid ? "Đã thanh toán" : "Chờ thanh toán"}
            </div>
          </div>

          <div className="border-t border-slate-50 pt-4 space-y-4">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-500">Đơn vị vận chuyển</span>
              <span className="text-slate-900 font-bold">GHN Express</span>
            </div>
            {shippingCode && (
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-500">Mã vận đơn</span>
                <span className="text-blue-600 font-mono text-xs font-bold">{shippingCode}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Người bán */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Store size={16} className="text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">Người bán</h3>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-900">Minh Tuấn Shop</p>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500 font-bold">
              <Star size={10} fill="currentColor" />
              <span>4.9 · 12.4k đánh giá</span>
            </div>
          </div>
          <button 
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all font-bold text-xs text-slate-700"
            onClick={() => router.push('/chat')}
          >
            <MessageCircle size={14} />
            Chat với shop
          </button>
        </div>
      </div>

      {/* Hỗ trợ */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle size={16} className="text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">Hỗ trợ</h3>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {status === OrderStatus.DELIVERED && !isReturning && !isReturned && (
            <button 
              onClick={onReturn}
              className="w-full flex items-center justify-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-xs text-slate-600"
            >
              <RotateCcw size={14} />
              Yêu cầu trả hàng / hoàn tiền
            </button>
          )}
          <button 
            onClick={onReport}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-xs text-slate-600"
          >
            <AlertCircle size={14} />
            Báo cáo vấn đề
          </button>
          {status === OrderStatus.DELIVERED && !isReviewed && (
            <button 
              onClick={onReview}
              className="w-full flex items-center justify-center gap-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all font-bold text-xs text-emerald-600"
            >
              <Star size={14} />
              Đánh giá ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
