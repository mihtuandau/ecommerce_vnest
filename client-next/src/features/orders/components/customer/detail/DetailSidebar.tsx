"use client";

import React from "react";
import { MapPin, CheckCircle2, CreditCard, Clock, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PaymentStatus } from "@/types/enums";
import { useToast } from "@/hooks/useToast";
import { paymentsApi } from "@/features/payments/api";
import { User } from "@/types/models";

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
  shippingCode 
}: DetailSidebarProps) {
  const [isPaying, setIsPaying] = React.useState(false);
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

  return (
    <div className="space-y-8 lg:sticky lg:top-24">
      {/* Shipping Info */}
      <div className="border border-slate-100 rounded-2xl p-6 space-y-6 bg-white">
        <div className="flex items-center gap-3 text-slate-900">
          <MapPin className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Thông tin nhận hàng</h3>
        </div>
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                {shippingSnapshot?.fullName || user?.name}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {shippingSnapshot?.phone || user?.phone}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 pt-5 border-t border-slate-50">
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {shippingSnapshot?.addressString || 
                [
                  shippingSnapshot?.street, 
                  shippingSnapshot?.ward, 
                  shippingSnapshot?.district, 
                  shippingSnapshot?.province
                ].filter(Boolean).join(", ") || 
                (typeof addressRelation === 'object' ? 
                  [addressRelation?.street, addressRelation?.ward, addressRelation?.district, addressRelation?.province || addressRelation?.city].filter(Boolean).join(", ") 
                  : addressRelation) || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Payment & Logistics */}
      <div className="border border-slate-100 rounded-2xl p-6 space-y-6 bg-white">
        <div className="flex items-center gap-3 text-slate-900">
          <CreditCard className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Thanh toán & Vận chuyển</h3>
        </div>
        <div className="space-y-4 text-sm font-medium">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Phương thức</span>
            <span className="text-slate-900">{paymentMethod || "COD"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Trạng thái</span>
            <span
              className={
                paymentStatus === "REFUNDED" || paymentStatus === PaymentStatus.REFUNDED
                  ? "text-purple-600"
                  : paymentStatus === "CANCELLED" || paymentStatus === PaymentStatus.CANCELLED
                    ? "text-rose-600"
                    : isPaid 
                      ? "text-emerald-600" 
                      : "text-amber-600"
              }
            >
              {paymentStatus === "REFUNDED" || paymentStatus === PaymentStatus.REFUNDED
                ? "Đã hoàn tiền"
                : paymentStatus === "CANCELLED" || paymentStatus === PaymentStatus.CANCELLED
                  ? "Đã hủy"
                  : isPaid 
                    ? "Đã thanh toán" 
                    : "Chờ thanh toán"}
            </span>
          </div>
          <div className="border-t border-slate-50 pt-4 flex justify-between items-center">
            <span className="text-slate-500">Đơn vị vận chuyển</span>
            <span className="text-slate-900">GHN Express</span>
          </div>
          {shippingCode && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Mã vận đơn</span>
              <span className="text-primary font-mono text-xs">{shippingCode}</span>
            </div>
          )}
        </div>
        
        {!isPaid && !isCancelled && !isReturned && !isReturning && paymentMethod !== "COD" && (
          <Button 
            onClick={handlePayNow}
            disabled={isPaying}
            className="w-full h-11 bg-primary hover:brightness-110 text-white text-xs font-bold rounded-xl mt-2 shadow-lg shadow-primary/10 transition-all active:scale-95 disabled:opacity-50"
          >
            {isPaying ? "Đang xử lý..." : "Thanh toán ngay"}
          </Button>
        )}
      </div>

      {/* Support Info */}
      <div className="border border-slate-100 rounded-2xl p-6 space-y-5 bg-slate-50/50">
        <div className="flex items-center gap-3 text-slate-900">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Hỗ trợ khách hàng</h3>
        </div>
        <div className="space-y-3">
          <button 
            onClick={() => window.open(`https://zalo.me/${process.env.NEXT_PUBLIC_ZALO || '0987654321'}`, '_blank')}
            className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl hover:border-primary/20 hover:bg-white transition-all group shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">Z</div>
              <span className="text-xs font-semibold text-slate-700">Chat Zalo hỗ trợ</span>
            </div>
            <ArrowRight size={14} className="text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </button>

          <a 
            href={`tel:${process.env.NEXT_PUBLIC_HOTLINE || '0987654321'}`}
            className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl hover:border-emerald-200 transition-all group shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Phone size={14} />
              </div>
              <span className="text-xs font-semibold text-slate-700">Hotline 24/7</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 px-2.5 py-1 bg-emerald-50 rounded-lg">Gọi ngay</span>
          </a>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium text-center italic">
          Thời gian hỗ trợ: 8h00 - 22h00 hàng ngày
        </p>
      </div>
    </div>
  );
}
