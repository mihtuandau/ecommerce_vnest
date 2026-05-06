"use client";

import React from "react";
import { MapPin, CheckCircle2, CreditCard } from "lucide-react";
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
    <div className="space-y-6">
      {/* Shipping Info */}
      <div className="border border-slate-100 rounded-xl p-5 space-y-4 bg-white">
        <div className="flex items-center gap-2 text-slate-500">
          <MapPin className="h-4 w-4" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">
            Giao nhận
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {shippingSnapshot?.fullName || user?.name}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {shippingSnapshot?.phone || user?.phone}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 border-t border-slate-50 pt-3">
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
              <MapPin className="h-4 w-4" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
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
      <div className="border border-slate-100 rounded-xl p-5 space-y-4 bg-white">
        <div className="flex items-center gap-2 text-slate-500">
          <CreditCard className="h-4 w-4" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">
            Thanh toán
          </h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Phương thức</span>
            <span className="font-medium text-slate-700">
              {paymentMethod || "COD"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Trạng thái</span>
            <span
              className={`font-medium ${
                paymentStatus === "REFUNDED" || paymentStatus === PaymentStatus.REFUNDED
                  ? "text-purple-600"
                  : paymentStatus === "CANCELLED" || paymentStatus === PaymentStatus.CANCELLED
                    ? "text-rose-600"
                    : isPaid 
                      ? "text-emerald-500" 
                      : "text-amber-600"
              }`}
            >
              {paymentStatus === "REFUNDED" || paymentStatus === PaymentStatus.REFUNDED
                ? "Đã hoàn tiền"
                : paymentStatus === "CANCELLED" || paymentStatus === PaymentStatus.CANCELLED
                  ? "Đã hủy thanh toán"
                  : isPaid 
                    ? "Đã thanh toán" 
                    : "Chờ thanh toán"}
            </span>
          </div>
          <div className="border-t border-slate-50 pt-3 flex justify-between items-center">
            <span className="text-slate-500">Vận chuyển</span>
            <span className="font-medium text-slate-700">GHN Express</span>
          </div>
          {shippingCode && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Mã vận đơn</span>
              <span className="font-medium text-primary font-mono">
                {shippingCode}
              </span>
            </div>
          )}
        </div>
        {!isPaid && !isCancelled && !isReturned && !isReturning && paymentMethod !== "COD" && (
          <Button 
            onClick={handlePayNow}
            disabled={isPaying}
            className="w-full h-9 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg mt-2 uppercase tracking-wider disabled:opacity-50"
          >
            {isPaying ? "Đang xử lý..." : "Thanh toán ngay"}
          </Button>
        )}
      </div>

      {/* Support Info */}
      <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
        <p className="text-xs text-slate-500 leading-relaxed italic">
          Thời gian giao hàng dự kiến từ 2-4 ngày làm việc tùy thuộc vào địa chỉ
          của bạn.
        </p>
      </div>
    </div>
  );
}
