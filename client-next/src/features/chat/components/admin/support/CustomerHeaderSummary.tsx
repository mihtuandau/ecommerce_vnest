"use client";

import React from "react";
import { Star } from "lucide-react";

interface CustomerHeaderSummaryProps {
  selectedRoom: any;
  customerDetails: any;
  ordersList: any[];
  totalSpent: number;
  avgRating: string | null;
  isLoading: boolean;
}

export function CustomerHeaderSummary({
  selectedRoom,
  customerDetails,
  ordersList,
  totalSpent,
  avgRating,
  isLoading,
}: CustomerHeaderSummaryProps) {
  return (
    <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
      <div className="relative inline-block mx-auto mb-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 border border-slate-200 flex items-center justify-center text-xl font-semibold text-slate-500 shadow-sm">
          {selectedRoom?.customer?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
      </div>

      <h4 className="text-sm font-semibold text-slate-800 tracking-tight">
        {customerDetails?.name || selectedRoom?.customer?.name || "Khách hàng"}
      </h4>

      {ordersList.length >= 3 || totalSpent > 5000000 ? (
        <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-lg mt-1.5 uppercase tracking-wider">
          <Star size={10} fill="currentColor" /> Thành viên VIP
        </div>
      ) : (
        <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-lg mt-1.5 uppercase tracking-wider">
          Thành viên Thường
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5 mt-5">
        <div className="bg-white p-2.5 rounded-xl text-center shadow-xs border border-slate-100">
          <div className="text-sm font-semibold text-slate-800">
            {isLoading ? "..." : ordersList.length}
          </div>
          <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
            Đơn hàng
          </div>
        </div>
        <div className="bg-white p-2.5 rounded-xl text-center shadow-xs border border-slate-100">
          <div className="text-sm font-semibold text-slate-800">
            {isLoading ? "..." : avgRating ? `${avgRating}★` : "N/A"}
          </div>
          <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
            Hài lòng
          </div>
        </div>
      </div>
    </div>
  );
}
