"use client";

import React from "react";
import { ShoppingBag, Wallet, Star, Clock } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

interface CustomerStatsProps {
  totalSpent: number;
  totalOrders: number;
  totalReviews: number;
  lastOrderDate?: string;
}

export function CustomerStats({ totalSpent, totalOrders, totalReviews, lastOrderDate }: CustomerStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center">
          <Wallet className="h-5 w-5 text-slate-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tổng chi tiêu</p>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(totalSpent)}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center">
          <ShoppingBag className="h-5 w-5 text-slate-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Đơn hàng</p>
          <p className="text-xl font-bold text-slate-900">{totalOrders}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center">
          <Star className="h-5 w-5 text-slate-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Đánh giá</p>
          <p className="text-xl font-bold text-slate-900">{totalReviews}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center">
          <Clock className="h-5 w-5 text-slate-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lần mua cuối</p>
          <p className="text-lg font-bold text-slate-900">
            {lastOrderDate ? "10 ngày" : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
