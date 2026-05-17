"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { OrderStatus } from "@/types/enums";

interface OrderStatsProps {
  counts: {
    ALL: number;
    PENDING: number;
    PROCESSING: number;
    SHIPPED: number;
    DELIVERED: number;
    CANCELLED: number;
    RETURN_REQUESTED: number;
    RETURNED: number;
  };
}

export function OrderStats({ counts }: OrderStatsProps) {
  const stats = [
    {
      id: "ALL",
      label: "Tất cả đơn",
      value: counts.ALL,
      delta: "↑ Cập nhật liên tục",
      deltaClass: "text-slate-500",
      colorClass: "before:bg-slate-800",
      activeClass: "ring-2 ring-slate-800",
      numClass: "text-slate-800"
    },
    {
      id: OrderStatus.PENDING,
      label: "Chờ xác nhận",
      value: counts.PENDING,
      delta: "⚠ Cần xử lý",
      deltaClass: "text-amber-600",
      colorClass: "before:bg-amber-500",
      activeClass: "ring-2 ring-amber-500",
      numClass: "text-amber-600"
    },
    {
      id: OrderStatus.SHIPPED,
      label: "Đang giao",
      value: counts.SHIPPED,
      delta: "↑ Đang trên đường",
      deltaClass: "text-blue-600",
      colorClass: "before:bg-blue-500",
      activeClass: "ring-2 ring-blue-500",
      numClass: "text-blue-600"
    },
    {
      id: OrderStatus.DELIVERED,
      label: "Đã giao",
      value: counts.DELIVERED,
      delta: "↑ Giao thành công",
      deltaClass: "text-emerald-600",
      colorClass: "before:bg-emerald-500",
      activeClass: "ring-2 ring-emerald-500",
      numClass: "text-emerald-600"
    },
    {
      id: OrderStatus.CANCELLED,
      label: "Đã huỷ",
      value: counts.CANCELLED,
      delta: "↓ Đã dừng xử lý",
      deltaClass: "text-rose-600",
      colorClass: "before:bg-rose-500",
      activeClass: "ring-2 ring-rose-500",
      numClass: "text-rose-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => {
        return (
          <div 
            key={stat.id}
            className={cn(
              "relative bg-white border border-slate-200 rounded-xl p-4 transition-all overflow-hidden shadow-sm",
              "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px]",
              stat.colorClass
            )}
          >
            <div className={cn("text-2xl font-bold font-serif leading-none", stat.numClass)}>
              {stat.value}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-2 mb-1">
              {stat.label}
            </div>
            <div className={cn("text-[10px] font-bold tracking-tight", stat.deltaClass)}>
              {stat.delta}
            </div>
          </div>
        );
      })}
    </div>
  );
}
