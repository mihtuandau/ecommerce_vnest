"use client";

import React from "react";
import { Ticket, Zap, Clock, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

interface DiscountStatsProps {
  total: number;
  active: number;
  flashSale: number;
  expired: number;
}

export function DiscountStats({ total, active, flashSale, expired }: DiscountStatsProps) {
  const stats = [
    {
      label: "Tổng chương trình",
      value: total,
      icon: Ticket,
      color: "text-slate-400",
      bg: "bg-slate-50",
    },
    {
      label: "Đang hoạt động",
      value: active,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50/50",
    },
    {
      label: "Flash Sale",
      value: flashSale,
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-50/50",
    },
    {
      label: "Đã hết hạn",
      value: expired,
      icon: Clock,
      color: "text-rose-500",
      bg: "bg-rose-50/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
