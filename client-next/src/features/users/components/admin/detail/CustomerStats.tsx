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

export function CustomerStats({
  totalSpent,
  totalOrders,
  totalReviews,
  lastOrderDate,
}: CustomerStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
          <Wallet className="h-5 w-5 text-slate-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400">
            Tổng chi tiêu
          </p>
          <p className="text-lg font-semibold text-slate-900">
            {formatCurrency(totalSpent)}
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
          <ShoppingBag className="h-5 w-5 text-slate-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400">
            Đơn hàng
          </p>
          <p className="text-lg font-semibold text-slate-900">{totalOrders}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
          <Star className="h-5 w-5 text-slate-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400">
            Đánh giá
          </p>
          <p className="text-lg font-semibold text-slate-900">{totalReviews}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
          <Clock className="h-5 w-5 text-slate-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400">
            Lần mua cuối
          </p>
          <p className="text-lg font-semibold text-slate-900">
            {lastOrderDate
              ? (() => {
                  const days = Math.floor(
                    (new Date().getTime() - new Date(lastOrderDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  if (days === 0) return "Hôm nay";
                  return `${days} ngày trước`;
                })()
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
