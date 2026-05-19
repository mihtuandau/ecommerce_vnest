"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { getSessionStatus, formatTimeRange } from "../../../utils/flashSaleUtils";
import { FLASH_SALE_CONSTANTS, FLASH_SALE_COLORS } from "@/features/discounts/constants";

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
                isActive ? `border-[${FLASH_SALE_COLORS.ACTIVE_BORDER}]` : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <span
                className={cn(
                  "text-[9.5px] font-bold px-[7px] py-[2px] rounded-full uppercase tracking-widest",
                  sStatus === FLASH_SALE_CONSTANTS.STATUS.LIVE
                    ? `bg-[${FLASH_SALE_COLORS.LIVE_BG}] text-white shadow-[0_0_8px_${FLASH_SALE_COLORS.LIVE_GLOW}]`
                    : sStatus === FLASH_SALE_CONSTANTS.STATUS.SOON
                    ? `bg-[${FLASH_SALE_COLORS.SOON_BG}] text-[${FLASH_SALE_COLORS.SOON_TEXT}] border border-[#F0D080]`
                    : `bg-[${FLASH_SALE_COLORS.ENDED_BG}] text-[${FLASH_SALE_COLORS.ENDED_TEXT}]`
                )}
              >
                {sStatus === FLASH_SALE_CONSTANTS.STATUS.LIVE 
                  ? FLASH_SALE_CONSTANTS.STATUS_LABELS.LIVE 
                  : sStatus === FLASH_SALE_CONSTANTS.STATUS.SOON 
                  ? FLASH_SALE_CONSTANTS.STATUS_LABELS.SOON 
                  : FLASH_SALE_CONSTANTS.STATUS_LABELS.ENDED}
              </span>
              <span
                className={cn(
                  "text-[13px] font-medium",
                  isActive ? `text-[${FLASH_SALE_COLORS.ACTIVE_BORDER}] font-bold` : `text-[${FLASH_SALE_COLORS.INACTIVE_TEXT}]`
                )}
              >
                {formatTimeRange(s.startDate, s.endDate)}
              </span>
              <span className={`text-[11px] text-[${FLASH_SALE_COLORS.INACTIVE_TEXT}]`}>
                {sStatus === FLASH_SALE_CONSTANTS.STATUS.LIVE ? "Giảm đến 70%" : s.description || "Ưu đãi sốc"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
