"use client";

import React from "react";
import { Zap, ShieldCheck, Headphones, CreditCard } from "lucide-react";

const BADGES = [
  {
    icon: Zap,
    title: "Giao hàng thần tốc",
    desc: "Nhận hàng trong 2–4 giờ tại HN & HCM",
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hành 12 tháng",
    desc: "Chính hãng 100%, lỗi 1 đổi 1 trong 30 ngày",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: CreditCard,
    title: "Thanh toán linh hoạt",
    desc: "Trả góp 0%, VNPay, MoMo, Visa",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    desc: "Chuyên gia tư vấn sẵn sàng mọi lúc",
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {BADGES.map((badge, index) => (
        <div
          key={index}
          className={`flex items-start gap-2.5 md:gap-4 p-3.5 md:p-5 bg-white rounded-2xl border ${badge.border} shadow-sm hover:shadow-md transition-shadow duration-300`}
        >
          <div
            className={`shrink-0 h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl ${badge.bg} flex items-center justify-center ${badge.color}`}
          >
            <badge.icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-xs md:text-sm leading-tight line-clamp-1">
              {badge.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{badge.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
