"use client";

import React from "react";
import { MapPin, CheckCircle2, CreditCard } from "lucide-react";

interface GuestDetailSidebarProps {
  shippingSnapshot: any;
  fullName?: string;
  phone?: string;
  address?: string;
  paymentMethod: string;
  isPaid: boolean;
  shippingCode?: string;
}

export function GuestDetailSidebar({ 
  shippingSnapshot, 
  fullName,
  phone,
  address,
  paymentMethod, 
  isPaid, 
  shippingCode 
}: GuestDetailSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Shipping Info */}
      <div className="border border-slate-100 rounded-xl p-5 space-y-4 bg-white">
        <div className="flex items-center gap-2 text-slate-500">
          <MapPin className="h-4 w-4" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">Giao nhận</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{shippingSnapshot?.fullName || fullName}</p>
              <p className="text-xs text-slate-500 mt-1">{shippingSnapshot?.phone || phone}</p>
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
                address || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Payment & Logistics */}
      <div className="border border-slate-100 rounded-xl p-5 space-y-4 bg-white">
        <div className="flex items-center gap-2 text-slate-500">
          <CreditCard className="h-4 w-4" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">Thanh toán</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Phương thức</span>
            <span className="font-medium text-slate-700">{paymentMethod || "COD"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Trạng thái</span>
            <span className={`font-medium ${isPaid ? "text-emerald-500" : "text-amber-600"}`}>
              {isPaid ? "Đã thanh toán" : "Chờ thanh toán"}
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
      <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
        <p className="text-xs text-slate-500 leading-relaxed italic">
          Thời gian giao hàng dự kiến từ 2-4 ngày làm việc tùy thuộc vào địa chỉ của bạn.
        </p>
      </div>
    </div>
  );
}
