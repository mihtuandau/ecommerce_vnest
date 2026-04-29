"use client";

import React from "react";
import { User, Phone, MapPin, Mail } from "lucide-react";

interface CustomerProps {
  order: any;
}

export function Customer({ order }: CustomerProps) {
  const orderAny = order as any;
  const snapshot = orderAny.shippingSnapshot;
  
  const customerName = snapshot?.fullName || orderAny.user?.name || "Khách hàng";
  const customerPhone = snapshot?.phone || orderAny.user?.phone || orderAny.guestPhone || "—";
  
  // Ghép địa chỉ từ snapshot (thông tin lúc đặt hàng)
  const snapshotAddress = snapshot 
    ? [snapshot.street, snapshot.ward, snapshot.district, snapshot.province]
        .filter(Boolean)
        .join(", ")
    : "";

  const customerAddress = snapshot?.addressString || snapshotAddress || "—";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-3">
         <User className="h-4 w-4 text-slate-500" />
         <h3 className="font-semibold text-sm text-slate-800">Thông tin khách hàng</h3>
      </div>
      <div className="space-y-5">
         <div className="flex items-start gap-3">
            <div className="mt-1"><User className="h-4 w-4 text-slate-500" /></div>
            <div className="space-y-0.5">
               <p className="text-[10px] font-medium text-slate-500 tracking-tight">Tên khách hàng</p>
               <p className="text-sm font-semibold text-slate-800">{customerName}</p>
            </div>
         </div>
          <div className="flex items-start gap-3">
            <div className="mt-1"><Phone className="h-4 w-4 text-slate-500" /></div>
            <div className="space-y-0.5">
               <p className="text-[10px] font-medium text-slate-500 tracking-tight">Số điện thoại</p>
               <p className="text-sm font-semibold text-slate-800">{customerPhone}</p>
            </div>
         </div>
         <div className="flex items-start gap-3">
            <div className="mt-1"><Mail className="h-4 w-4 text-slate-500" /></div>
            <div className="space-y-0.5">
               <p className="text-[10px] font-medium text-slate-500 tracking-tight">Email</p>
               <p className="text-sm font-semibold text-slate-800">
                  {orderAny.shippingSnapshot?.email || orderAny.guestEmail || orderAny.user?.email || "—"}
               </p>
            </div>
         </div>
         <div className="flex items-start gap-3">
            <div className="mt-1"><MapPin className="h-4 w-4 text-slate-500" /></div>
            <div className="space-y-0.5">
               <p className="text-[10px] font-medium text-slate-500 tracking-tight">Địa chỉ nhận hàng</p>
               <p className="text-sm font-medium text-slate-700 leading-relaxed">{customerAddress}</p>
            </div>
         </div>
      </div>
    </div>
  );
}
