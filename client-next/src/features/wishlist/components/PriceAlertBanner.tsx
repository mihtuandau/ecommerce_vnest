"use client";

import React from "react";
import { TrendingDown, Bell } from "lucide-react";

interface PriceAlertBannerProps {
  discountedCount: number;
  discountedNames: string;
  onViewDiscountClick: () => void;
  onNotifyClick: () => void;
}

export function PriceAlertBanner({
  discountedCount,
  discountedNames,
  onViewDiscountClick,
  onNotifyClick,
}: PriceAlertBannerProps) {
  return (
    <div className="bg-gradient-to-r from-brand-espresso to-[#523A25] rounded-2xl p-5 md:p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm border border-brand-sand/20 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="space-y-1.5 flex items-start gap-3">
        <div className="bg-white/10 p-2 rounded-xl text-brand-cream mt-0.5 shrink-0">
          <TrendingDown className="w-5 h-5 text-brand-bronze" />
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-[17px] md:text-lg font-semibold text-brand-cream leading-snug">
            {discountedCount} sản phẩm vừa giảm giá trong danh sách của bạn!
          </h3>
          <p className="text-brand-cream/70 text-xs md:text-[13px] max-w-2xl line-clamp-1 leading-relaxed">
            {discountedNames}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
        <button
          onClick={onViewDiscountClick}
          className="px-5 py-2.5 bg-brand-bronze hover:bg-brand-bronze/95 text-white text-[13px] rounded-full transition-all shadow-sm"
        >
          Xem ngay →
        </button>
        <button
          onClick={onNotifyClick}
          className="px-4 py-2.5 border border-white/20 hover:bg-white/10 text-white text-[13px] font-semibold rounded-full transition-all flex items-center gap-1.5"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Thông báo cho tôi</span>
        </button>
      </div>
    </div>
  );
}
