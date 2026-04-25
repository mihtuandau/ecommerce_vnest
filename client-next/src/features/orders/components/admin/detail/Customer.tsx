"use client";

import React from "react";
import { User, Phone, MapPin } from "lucide-react";

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
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-6">
         <User className="h-4 w-4 text-slate-400" />
         <h3 className="font-bold text-sm text-slate-900">Thông tin khách hàng</h3>
      </div>
      <div className="space-y-5">
         <div className="flex items-start gap-3">
            <div className="mt-1"><User className="h-4 w-4 text-slate-400" /></div>
            <div className="space-y-0.5">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tên khách hàng</p>
               <p className="text-sm font-bold text-slate-900">{customerName}</p>
            </div>
         </div>
         <div className="flex items-start gap-3">
            <div className="mt-1"><Phone className="h-4 w-4 text-slate-400" /></div>
            <div className="space-y-0.5">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Số điện thoại</p>
               <p className="text-sm font-bold text-slate-900">{customerPhone}</p>
            </div>
         </div>
         <div className="flex items-start gap-3">
            <div className="mt-1"><MapPin className="h-4 w-4 text-slate-400" /></div>
            <div className="space-y-0.5">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Địa chỉ nhận hàng</p>
               <p className="text-sm font-semibold text-slate-700 leading-relaxed">{customerAddress}</p>
            </div>
         </div>
      </div>
    </div>
  );
}
