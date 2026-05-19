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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {BADGES.map((badge, index) => (
        <div
          key={index}
          className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#DDD6C8] hover:border-[#C4B49A] transition-all duration-300"
        >
          <div className="shrink-0 h-11 w-11 rounded-xl bg-[#F3EFE8] flex items-center justify-center text-[#8B6F47]">
            <badge.icon className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-[#3D2B1A] text-sm leading-tight">
              {badge.title}
            </h3>
            <p className="text-[12px] text-[#8A7966] mt-1 leading-relaxed line-clamp-2">
              {badge.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
