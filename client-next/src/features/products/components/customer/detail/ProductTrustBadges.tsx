"use client";

import React from "react";
import { Truck, ShieldCheck, RotateCcw, Award } from "lucide-react";
import { cn } from "@/utils/cn";

const BADGES = [
  {
    icon: Truck,
    title: "Giao hàng nhanh",
    description: "Từ 2-3 ngày làm việc",
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    icon: ShieldCheck,
    title: "Bảo hành 12 tháng",
    description: "Chính hãng 100%",
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    icon: RotateCcw,
    title: "Đổi trả 30 ngày",
    description: "Nếu có lỗi nhà sản xuất",
    color: "text-orange-600",
    bg: "bg-orange-50"
  },
  {
    icon: Award,
    title: "Cam kết chất lượng",
    description: "Hoàn tiền nếu không ưng ý",
    color: "text-purple-600",
    bg: "bg-purple-50"
  }
];

export function ProductTrustBadges() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
      {BADGES.map((badge, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-md transition-all duration-300 group">
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110",
            badge.bg,
            badge.color
          )}>
            <badge.icon size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-slate-900 leading-tight">
              {badge.title}
            </span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5">
              {badge.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
