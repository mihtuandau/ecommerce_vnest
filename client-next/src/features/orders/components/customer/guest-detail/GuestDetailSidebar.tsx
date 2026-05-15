"use client";

import React from "react";
import { 
  MapPin, 
  CreditCard, 
  Phone, 
  User as UserIcon,
  Store,
  Star,
  MessageSquare,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Truck,
  Wallet,
  Smartphone,
  Mail
} from "lucide-react";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";

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
  
  const recipientName = shippingSnapshot?.fullName || fullName || "Khách hàng LUXE";
  const phoneToDisplay = shippingSnapshot?.phone || phone || "Chưa cập nhật";
  const emailToDisplay = shippingSnapshot?.email || email;

  const addressToDisplay = shippingSnapshot?.addressString || 
    [
      shippingSnapshot?.street, 
      shippingSnapshot?.ward, 
      shippingSnapshot?.district, 
      shippingSnapshot?.province
    ].filter(Boolean).join(", ") || 
    (typeof address === 'object' ? 
      [address?.street, address?.ward, address?.district, address?.province || address?.city].filter(Boolean).join(", ") 
      : address) || "Chưa cập nhật địa chỉ giao hàng";

  return (
    <div className="flex flex-col gap-4 font-sans-brand animate-in fade-in slide-in-from-right-4 duration-700">
      {/* 📍 DELIVERY INFO */}
      <div className="bg-white border border-[#DDD6C8] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-[18px] py-[14px] border-b border-[#DDD6C8] text-[13px] font-bold text-[#3D2B1A] flex items-center gap-2">
           <MapPin size={16} className="text-[#C4783A]" /> Thông tin giao hàng
        </div>
        <div className="p-[18px] space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-[#8A7966] uppercase tracking-[0.06em]">Người nhận</p>
            <p className="text-[13.5px] font-bold text-[#3D2B1A]">{recipientName}</p>
          </div>
          <hr className="border-t border-[#DDD6C8]" />
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-[#8A7966] uppercase tracking-[0.06em]">Số điện thoại</p>
            <p className="text-[13.5px] text-[#3D2B1A]">{phoneToDisplay}</p>
            {emailToDisplay && (
               <p className="text-[12px] text-[#8A7966] mt-0.5">{emailToDisplay}</p>
            )}
          </div>
          <hr className="border-t border-[#DDD6C8]" />
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-[#8A7966] uppercase tracking-[0.06em]">Địa chỉ</p>
            <p className="text-[13.5px] text-[#3D2B1A] leading-relaxed">{addressToDisplay}</p>
          </div>
        </div>
      </div>

      {/* 💳 PAYMENT INFO */}
      <div className="bg-white border border-[#DDD6C8] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-[18px] py-[14px] border-b border-[#DDD6C8] text-[13px] font-bold text-[#3D2B1A] flex items-center gap-2">
           <CreditCard size={16} className="text-[#C4783A]" /> Thanh toán
        </div>
        <div className="p-[18px] space-y-3">
          {paymentMethod?.toLowerCase().includes("visa") || paymentMethod?.toLowerCase().includes("card") ? (
            <div className="bg-gradient-to-br from-[#3D2B1A] to-[#5C3820] rounded-xl p-4 text-white space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[13px] font-bold tracking-widest opacity-80 uppercase">LUXE Bank</span>
                <span className="text-xl font-serif-brand font-black italic opacity-60">VISA</span>
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
            <div className="flex items-center gap-3 p-3 bg-[#FAF8F4] border border-[#DDD6C8] rounded-xl">
               <span className="p-2 bg-white rounded-lg border border-[#DDD6C8]">
                 {paymentMethod === "COD" ? <Wallet size={20} className="text-[#C4783A]" /> : <Smartphone size={20} className="text-[#2C5F8A]" />}
               </span>
                <div>
                  <p className="text-[13.5px] font-bold text-[#3D2B1A]">{paymentMethod === "COD" ? "Tiền mặt khi nhận hàng (COD)" : "Chuyển khoản / Ví điện tử"}</p>
                  <p className={cn("text-[11px] font-bold uppercase tracking-wider mt-0.5", isPaid ? "text-[#3A7D5A]" : "text-[#C44040]")}>
                    {isPaid ? "● Đã thanh toán" : "○ Chờ thanh toán"}
                  </p>
                </div>
            </div>
          )}
          
          <div className="pt-2 flex flex-col gap-1">
            <p className="text-[11px] font-bold text-[#8A7966] uppercase tracking-[0.06em]">Tổng thanh toán</p>
            <p className="text-[18px] font-bold text-[#C4783A] font-serif-brand">{formatCurrency(total)}</p>
          </div>
          {shippingCode && (
            <div className="pt-2">
               <p className="text-[11px] font-bold text-[#8A7966] uppercase tracking-[0.06em]">Mã vận đơn</p>
               <p className="text-[13.5px] font-bold text-[#3D2B1A] font-mono">{shippingCode}</p>
            </div>
          )}
        </div>
      </div>

      {/* 📞 SUPPORT BOX */}
      <div className="bg-[#F3EFE8] border border-[#DDD6C8] rounded-2xl p-[18px] text-center space-y-4">
        <div className="space-y-1.5">
          <h4 className="text-[14px] font-bold text-[#3D2B1A]">Cần hỗ trợ?</h4>
          <p className="text-[12.5px] text-[#8A7966] leading-relaxed">Liên hệ đội ngũ LUXE nếu bạn gặp vấn đề với đơn hàng này.</p>
        </div>
        <div className="flex flex-col gap-2">
          <a href={`tel:${process.env.NEXT_PUBLIC_HOTLINE || '18001234'}`} className="flex items-center justify-center gap-2 py-2.5 bg-white border-1.5 border-[#DDD6C8] rounded-xl text-[13px] font-medium text-[#3D2B1A] hover:bg-[#FAF8F4] transition-all">
            <Phone size={14} className="text-[#3D2B1A]" />
            Gọi {process.env.NEXT_PUBLIC_HOTLINE || '1800 1234'}
          </a>
          <button 
            onClick={() => window.open(`https://zalo.me/${process.env.NEXT_PUBLIC_ZALO || '0987654321'}`, '_blank')}
            className="flex items-center justify-center gap-2 py-2.5 bg-white border-1.5 border-[#DDD6C8] rounded-xl text-[13px] font-medium text-[#3D2B1A] hover:bg-[#FAF8F4] transition-all"
          >
            <MessageSquare size={14} className="text-[#3D2B1A]" />
            Chat với LUXE
          </button>
        </div>
      </div>
    </div>
  );
}
