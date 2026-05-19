"use client";

import React from "react";
import { Zap } from "lucide-react";
import { FlashSaleCountdown } from "./FlashSaleCountdown";
import { getSessionStatus } from "../../../utils/flashSaleUtils";

interface FlashSaleHeroProps {
  activeSession: any;
  status: string;
  totalStats: { count: number; soldPercent: number };
}

export function FlashSaleHero({
  activeSession,
  status,
  totalStats,
}: FlashSaleHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1A0A00] via-[#3D1500] to-[#6B2800] px-12 py-16 md:py-[52px]">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[3px] h-[3px] bg-[#FF6B35] rounded-full animate-pulse"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(232,50,10,0.25)_0%,transparent_60%)]" />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-10">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 bg-[#E8320A]/25 border border-[#FF6B35]/40 text-[#FF6B35] text-[12px] font-bold px-[14px] py-[5px] rounded-full uppercase tracking-widest w-fit">
            <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
            {status === "LIVE"
              ? "Đang diễn ra"
              : status === "SOON"
                ? "Sắp diễn ra"
                : "Đã kết thúc"}
          </div>
          <h1 className="font-serif text-[68px] text-white font-semibold leading-none">
            Flash
            <br />
            <em className="italic bg-gradient-to-r from-[#FF6B35] to-[#FFB347] bg-clip-text text-fill-transparent not-italic">
              Sale
            </em>
          </h1>
          <p className="text-white/60 text-[16px] max-w-[420px] leading-relaxed">
            {activeSession?.description ||
              "Hàng ngàn sản phẩm chính hãng giảm đến 70%. Số lượng có hạn — nhanh tay kẻo lỡ!"}
          </p>
          <div className="flex gap-7 mt-1">
            <div className="text-center">
              <strong className="block font-serif text-[28px] text-white">
                {totalStats.count}
              </strong>
              <span className="text-[11px] text-white/50 uppercase tracking-wider">
                Sản phẩm
              </span>
            </div>
            <div className="text-center">
              <strong className="block font-serif text-[28px] text-white">
                {activeSession?.percentage || 0}%
              </strong>
              <span className="text-[11px] text-white/50 uppercase tracking-wider">
                Giảm tối đa
              </span>
            </div>
            <div className="text-center">
              <strong className="block font-serif text-[28px] text-white">8.4k</strong>
              <span className="text-[11px] text-white/50 uppercase tracking-wider">
                Đang xem
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="text-[11px] text-white/50 uppercase tracking-widest font-bold">
            ⏳{" "}
            {status === "LIVE"
              ? "Kết thúc sau"
              : status === "SOON"
                ? "Bắt đầu sau"
                : "Thời gian đã hết"}
          </div>
          <FlashSaleCountdown
            endDate={
              status === "LIVE"
                ? activeSession?.endDate
                : status === "SOON"
                  ? activeSession?.startDate
                  : undefined
            }
          />
          <div className="mt-1 w-[280px]">
            <div className="h-[6px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E8320A] to-[#FF6B35] transition-all duration-1000"
                style={{ width: `${totalStats.soldPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-white/40 mt-[5px] text-center uppercase tracking-widest">
              ⚡ {totalStats.soldPercent}% sản phẩm đã bán
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
