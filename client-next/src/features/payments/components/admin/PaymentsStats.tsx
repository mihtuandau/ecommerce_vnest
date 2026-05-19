"use client";

import React from "react";
import { TrendingUp, Coins, ArrowUpRight } from "lucide-react";

interface PaymentsStatsProps {
  payments: any[];
  formatCurrency: (val: number) => string;
}

export function PaymentsStats({ payments, formatCurrency }: PaymentsStatsProps) {
  // Calculate statistics based on loaded payments
  const totalSuccess = payments
    .filter((p: any) => p.status === "SUCCESS")
    .reduce((sum: number, p: any) => sum + p.amount, 0);

  const totalPendingCash = payments
    .filter((p: any) => p.status === "PENDING" && p.method === "CASH")
    .reduce((sum: number, p: any) => sum + p.amount, 0);

  const totalRefunded = payments
    .filter((p: any) => p.status === "REFUNDED")
    .reduce((sum: number, p: any) => sum + (p.refundAmount || p.amount), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Doanh thu thực nhận */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-32">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-450 uppercase tracking-wider">
            Doanh thu đối soát
          </span>
          <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 leading-tight">
            {formatCurrency(totalSuccess)}
          </h3>
          <p className="text-[10px] text-emerald-650 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" /> Giao dịch thành công (Hệ thống)
          </p>
        </div>
      </div>

      {/* Card 2: COD chờ thu tiền */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-32">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-450 uppercase tracking-wider">
            Phải thu COD
          </span>
          <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Coins className="h-5 w-5" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 leading-tight">
            {formatCurrency(totalPendingCash)}
          </h3>
          <p className="text-[10px] text-amber-650 font-bold mt-1 flex items-center gap-1">
            Chờ thanh toán khi nhận hàng (Hệ thống)
          </p>
        </div>
      </div>

      {/* Card 3: Số tiền đã hoàn trả */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-32">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-450 uppercase tracking-wider">
            Hoàn trả tài chính
          </span>
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Coins className="h-5 w-5" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 leading-tight">
            {formatCurrency(totalRefunded)}
          </h3>
          <p className="text-[10px] text-blue-650 font-bold mt-1">
            Giao dịch hoàn tiền thành công (Hệ thống)
          </p>
        </div>
      </div>
    </div>
  );
}
