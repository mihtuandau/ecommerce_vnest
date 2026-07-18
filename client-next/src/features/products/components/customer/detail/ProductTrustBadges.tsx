"use client";

import React from "react";
import { Truck, ShieldCheck, RotateCcw, Award } from "lucide-react";
import { InfoCard } from "./InfoCard";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 pt-10 border-t border-brand-ivory">
      {BADGES.map((badge, i) => (
        <InfoCard
          key={i}
          icon={badge.icon}
          title={badge.title}
          description={badge.description}
        />
      ))}
    </div>
  );
}
