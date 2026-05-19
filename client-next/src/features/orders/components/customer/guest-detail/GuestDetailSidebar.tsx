"use client";

import React from "react";
import { 
  MapPin, 
  CreditCard, 
  Phone, 
  User, 
  MessageSquare,
  Wallet,
  Smartphone,
  Mail
} from "lucide-react";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";
import { ORDERS_CONTACT } from "@/features/orders";

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
  total: number;
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
  shippingCode,
  total
}: GuestDetailSidebarProps) {
  
  let snap = shippingSnapshot;
  if (typeof snap === "string") {
    try {
      snap = JSON.parse(snap);
    } catch (e) {}
  }

  const recipientName = snap?.fullName || fullName || "Khách hàng LUXE";
  const phoneToDisplay = snap?.phone || phone || "Chưa cập nhật";
  const emailToDisplay = snap?.email || email;

  const addressToDisplay = snap?.addressString || 
    [
      snap?.street, 
      snap?.ward, 
      snap?.district, 
      snap?.province
    ].filter(Boolean).join(", ") || 
    (typeof address === 'object' ? 
      [address?.street, address?.ward, address?.district, address?.province || address?.city].filter(Boolean).join(", ") 
      : address) || "Chưa cập nhật địa chỉ giao hàng";

  return (
    <div className="flex flex-col gap-4 font-sans-brand animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="bg-white border border-brand-sand rounded-2xl overflow-hidden shadow-sm">
        <div className="px-[18px] py-[14px] border-b border-brand-sand text-[13px] font-bold text-brand-espresso flex items-center gap-2">
           <MapPin size={16} className="text-brand-bronze" /> Thông tin giao hàng
        </div>
        <div className="p-[18px] space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-brand-taupe uppercase tracking-[0.06em]">Người nhận</p>
            <p className="text-[13.5px] font-bold text-brand-espresso">{recipientName}</p>
          </div>
          <hr className="border-t border-brand-sand" />
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-brand-taupe uppercase tracking-[0.06em]">Số điện thoại</p>
            <p className="text-[13.5px] text-brand-espresso">{phoneToDisplay}</p>
            {emailToDisplay && (
               <p className="text-[12px] text-brand-taupe mt-0.5">{emailToDisplay}</p>
            )}
          </div>
          <hr className="border-t border-brand-sand" />
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-brand-taupe uppercase tracking-[0.06em]">Địa chỉ</p>
            <p className="text-[13.5px] text-brand-espresso leading-relaxed">{addressToDisplay}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-brand-sand rounded-2xl overflow-hidden shadow-sm">
        <div className="px-[18px] py-[14px] border-b border-brand-sand text-[13px] font-bold text-brand-espresso flex items-center gap-2">
           <CreditCard size={16} className="text-brand-bronze" /> Thanh toán
        </div>
        <div className="p-[18px] space-y-3">
          {paymentMethod?.toLowerCase().includes("visa") || paymentMethod?.toLowerCase().includes("card") ? (
            <div className="bg-gradient-to-br from-brand-espresso to-brand-espresso/90 rounded-xl p-4 text-white space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[13px] font-bold tracking-widest opacity-80 uppercase">LUXE Bank</span>
                <span className="text-xl font-bold italic opacity-60">VISA</span>
              </div>
              <div className="space-y-2">
                <p className="text-[14px] font-mono tracking-[0.2em] opacity-80">•••• •••• •••• 1234</p>
                <div className="flex justify-between items-end">
                  <p className="text-[11px] uppercase tracking-widest opacity-60">{recipientName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                    {isPaid ? "Đã thanh toán" : "Chờ thanh toán"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-brand-cream border border-brand-sand rounded-xl">
               <span className="p-2 bg-white rounded-lg border border-brand-sand">
                 {paymentMethod === "COD" ? <Wallet size={20} className="text-brand-bronze" /> : <Smartphone size={20} className="text-blue-600" />}
               </span>
                <div>
                   <p className="text-[13.5px] font-bold text-brand-espresso">{paymentMethod === "COD" ? "Tiền mặt khi nhận hàng (COD)" : "Chuyển khoản / Ví điện tử"}</p>
                  <p className={cn("text-[11px] font-bold uppercase tracking-wider mt-0.5", isPaid ? "text-emerald-700" : "text-red-600")}>
                    {isPaid ? "● Đã thanh toán" : "○ Chờ thanh toán"}
                  </p>
                </div>
            </div>
          )}
          
          <div className="pt-2 flex flex-col gap-1">
            <p className="text-[11px] font-bold text-brand-taupe uppercase tracking-[0.06em]">Tổng thanh toán</p>
            <p className="text-[18px] font-bold text-brand-bronze font-sans tabular-nums">{formatCurrency(total)}</p>
          </div>
          {shippingCode && (
            <div className="pt-2">
               <p className="text-[11px] font-bold text-brand-taupe uppercase tracking-[0.06em]">Mã vận đơn</p>
               <p className="text-[13.5px] font-bold text-brand-espresso font-mono">{shippingCode}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-brand-cream border border-brand-sand rounded-2xl p-[18px] text-center space-y-4">
        <div className="space-y-1.5">
          <h4 className="text-[14px] font-bold text-brand-espresso">Cần hỗ trợ?</h4>
          <p className="text-[12.5px] text-brand-taupe leading-relaxed">Liên hệ đội ngũ LUXE nếu bạn gặp vấn đề với đơn hàng này.</p>
        </div>
        <div className="flex flex-col gap-2">
          <a href={`tel:${process.env.NEXT_PUBLIC_HOTLINE || '19008888'}`} className="flex items-center justify-center gap-2 py-2.5 bg-white border border-brand-sand rounded-xl text-[13px] font-medium text-brand-espresso hover:bg-brand-cream transition-all">
            <Phone size={14} className="text-brand-espresso" />
            Gọi {process.env.NEXT_PUBLIC_HOTLINE || '1900 8888'}
          </a>
          <button 
            onClick={() => window.open(`${ORDERS_CONTACT.ZALO_BASE_URL}/${process.env.NEXT_PUBLIC_ZALO }`, '_blank')}
            className="flex items-center justify-center gap-2 py-2.5 bg-white border border-brand-sand rounded-xl text-[13px] font-medium text-brand-espresso hover:bg-brand-cream transition-all"
          >
            <MessageSquare size={14} className="text-brand-espresso" />
            Chat với LUXE
          </button>
        </div>
      </div>
    </div>
  );
}
