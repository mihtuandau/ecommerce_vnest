"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { getSessionStatus, formatTimeRange } from "../../../utils/flashSaleUtils";

interface FlashSaleSessionBarProps {
  sessions: any[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
}

export function FlashSaleSessionBar({
  sessions,
  activeSessionId,
  onSelectSession,
}: FlashSaleSessionBarProps) {
  return (
    <div className="sticky top-0 md:top-[68px] z-50 bg-white border-b-2 border-[#DDD6C8] overflow-x-auto no-scrollbar">
      <div className="max-w-[1440px] mx-auto flex items-center px-12">
        {sessions.map((s) => {
          const sStatus = getSessionStatus(s.startDate, s.endDate);
          const isActive = s.id === activeSessionId;
          return (
            <button
              key={s.id}
              onClick={() => onSelectSession(s.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-[14px] px-[22px] border-b-[2.5px] transition-all min-w-[170px]",
                isActive ? "border-[#E8320A]" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <span
                className={cn(
                  "text-[9.5px] font-bold px-[7px] py-[2px] rounded-full uppercase tracking-widest",
                  sStatus === "LIVE"
                    ? "bg-[#E8320A] text-white shadow-[0_0_8px_rgba(232,50,10,0.6)]"
                    : sStatus === "SOON"
                    ? "bg-[#FFF8E6] text-[#C49A00] border border-[#F0D080]"
                    : "bg-[#F3EFE8] text-[#8A7966]"
                )}
              >
                {sStatus === "LIVE" ? "🔴 LIVE" : sStatus === "SOON" ? "Sắp tới" : "Đã xong"}
              </span>
              <span
                className={cn(
                  "text-[13px] font-medium",
                  isActive ? "text-[#E8320A] font-bold" : "text-[#8A7966]"
                )}
              >
                {formatTimeRange(s.startDate, s.endDate)}
              </span>
              <span className="text-[11px] text-[#8A7966]">
                {sStatus === "LIVE" ? "Giảm đến 70%" : s.description || "Ưu đãi sốc"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
