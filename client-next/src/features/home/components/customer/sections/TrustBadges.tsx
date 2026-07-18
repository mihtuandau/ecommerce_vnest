"use client";

import React from "react";
import { Zap, ShieldCheck, Headphones, CreditCard } from "lucide-react";

const BADGES = [
  {
    icon: Zap,
    title: "Giao hàng thần tốc",
    desc: "Nhận hàng trong 2–4 giờ tại HN & HCM",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hành 12 tháng",
    desc: "Chính hãng 100%, lỗi 1 đổi 1 trong 30 ngày",
  },
  {
    icon: CreditCard,
    title: "Thanh toán linh hoạt",
    desc: "Trả góp 0%, VNPay, MoMo, Visa",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    desc: "Chuyên gia tư vấn sẵn sàng mọi lúc",
  },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-x-0 lg:divide-y-0 lg:divide-x divide-brand-sand/50 border-y border-brand-sand/50">
      {BADGES.map((badge, index) => (
        <div key={index} className="flex items-center gap-4 py-6 px-2 lg:px-6">
          <badge.icon
            className="h-5 w-5 text-brand-accent shrink-0"
            strokeWidth={1.6}
          />
          <div className="min-w-0">
            <h3 className="font-medium text-brand-espresso text-[13px] leading-tight">
              {badge.title}
            </h3>
            <p className="text-[11px] text-brand-taupe mt-1 leading-relaxed hidden sm:block">
              {badge.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
