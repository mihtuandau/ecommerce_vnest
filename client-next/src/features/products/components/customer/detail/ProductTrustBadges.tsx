"use client";

import React from "react";
import { Truck, ShieldCheck, RotateCcw, Award } from "lucide-react";
import { cn } from "@/utils/cn";

const BADGES = [
  {
    icon: Truck,
    title: "Giao hàng nhanh",
    description: "Từ 2-3 ngày làm việc",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hành 12 tháng",
    description: "Chính hãng 100%",
  },
  {
    icon: RotateCcw,
    title: "Đổi trả 30 ngày",
    description: "Nếu có lỗi nhà sản xuất",
  },
  {
    icon: Award,
    title: "Cam kết chất lượng",
    description: "Hoàn tiền nếu không ưng ý",
  },
];

export function ProductTrustBadges() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 pt-10 border-t border-[#F3EFE8]">
      {BADGES.map((badge, i) => (
        <div key={i} className="flex items-center gap-5 group">
          <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 bg-[#FBF9F6] border border-[#F3EFE8] text-[#C4783A] transition-all duration-300 group-hover:bg-[#3D2B1A] group-hover:text-white group-hover:border-[#3D2B1A]">
            <badge.icon size={20} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[#3D2B1A] leading-tight">
              {badge.title}
            </span>
            <span className="text-[12px] font-medium text-[#8A7966] mt-1">
              {badge.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
