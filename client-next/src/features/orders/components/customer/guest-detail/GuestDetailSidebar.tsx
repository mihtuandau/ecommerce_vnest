"use client";

import React from "react";
import { MapPin, CheckCircle2, CreditCard, Mail, Clock, Phone, ArrowRight } from "lucide-react";

interface GuestDetailSidebarProps {
  shippingSnapshot: any;
  fullName?: string;
  phone?: string;
  email?: string;
  address?: any;
  paymentMethod: string;
  isPaid: boolean;
  paymentStatus?: string;
  shippingCode?: string;
}

export function GuestDetailSidebar({ 
  shippingSnapshot, 
  fullName,
  phone,
  email,
  address,
  paymentMethod, 
  isPaid, 
  paymentStatus,
  shippingCode 
}: GuestDetailSidebarProps) {
  
  const phoneToDisplay = shippingSnapshot?.phone || phone;
  const maskedPhone = phoneToDisplay && phoneToDisplay.length >= 10 
    ? `${phoneToDisplay.substring(0, 3)}****${phoneToDisplay.substring(phoneToDisplay.length - 3)}`
    : phoneToDisplay;

  const emailToDisplay = shippingSnapshot?.email || email;
  const maskEmail = (emailStr?: string) => {
    if (!emailStr || !emailStr.includes("@")) return emailStr;
    const [name, domain] = emailStr.split("@");
    if (name.length <= 3) return `${name[0]}***@${domain}`;
    return `${name.substring(0, 2)}****${name.substring(name.length - 1)}@${domain}`;
  };
  const maskedEmail = maskEmail(emailToDisplay);

  return (
    <div className="space-y-6">
      {/* Shipping Info */}
      <div className="border border-slate-100 rounded-xl p-5 space-y-4 bg-white">
        <div className="flex items-center gap-2 text-slate-500">
          <MapPin className="h-4 w-4" />
          <h3 className="text-xs font-semibold">Giao nhận</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{shippingSnapshot?.fullName || fullName}</p>
              <div className="space-y-0.5 mt-1">
                <p className="text-xs text-slate-500 font-medium">{maskedPhone}</p>
                {maskedEmail && (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Mail size={10} />
                    <p className="text-[11px] font-medium">{maskedEmail}</p>
                  </div>
                )}
              </div>
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
                (typeof address === 'object' ? 
                  [address?.street, address?.ward, address?.district, address?.province || address?.city].filter(Boolean).join(", ") 
                  : address) || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Payment & Logistics */}
      <div className="border border-slate-100 rounded-xl p-5 space-y-4 bg-white">
        <div className="flex items-center gap-2 text-slate-500">
          <CreditCard className="h-4 w-4" />
          <h3 className="text-xs font-semibold">Thanh toán</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Phương thức</span>
            <span className="font-medium text-slate-700">{paymentMethod || "COD"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Trạng thái</span>
            <span
              className={`font-medium ${
                paymentStatus === "REFUNDED"
                  ? "text-purple-600"
                  : paymentStatus === "CANCELLED"
                    ? "text-rose-600"
                    : isPaid 
                      ? "text-emerald-500" 
                      : "text-amber-600"
              }`}
            >
              {paymentStatus === "REFUNDED"
                ? "Đã hoàn tiền"
                : paymentStatus === "CANCELLED"
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
              <span className="font-medium text-primary font-mono">{shippingCode}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Support Info */}
      <div className="border border-slate-100 rounded-xl p-5 space-y-4 bg-slate-50/50">
        <div className="flex items-center gap-2 text-slate-500">
          <Clock className="h-4 w-4" />
          <h3 className="text-xs font-semibold">Hỗ trợ trực tuyến</h3>
        </div>
        <div className="space-y-2.5">
          <button 
            onClick={() => window.open(`https://zalo.me/${process.env.NEXT_PUBLIC_ZALO || '0987654321'}`, '_blank')}
            className="w-full flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">Z</div>
              <span className="text-xs font-bold text-slate-700">Chat Zalo</span>
            </div>
            <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
          </button>

          <a 
            href={`tel:${process.env.NEXT_PUBLIC_HOTLINE || '0987654321'}`}
            className="w-full flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md bg-emerald-500 flex items-center justify-center text-white">
                <Phone size={14} />
              </div>
              <span className="text-xs font-bold text-slate-700">Hotline 24/7</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded">Gọi ngay</span>
          </a>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed italic text-center">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn từ 8h00 - 22h00 hàng ngày.
        </p>
      </div>
    </div>
  );
}
