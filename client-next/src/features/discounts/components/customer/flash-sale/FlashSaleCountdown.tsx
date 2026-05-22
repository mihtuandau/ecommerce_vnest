"use client";

import React, { useState, useEffect } from "react";
import { getTimeLeft } from "@/utils/formatDate";
import { pad } from "../../../utils/flashSaleUtils";
import {
  FLASH_SALE_CONSTANTS,
  FLASH_SALE_MESSAGES,
} from "@/features/discounts/constants";

export function FlashSaleCountdown({ endDate }: { endDate?: string }) {
  const [time, setTime] = useState(() => (endDate ? getTimeLeft(endDate) : null));

  useEffect(() => {
    if (!endDate) return;
    const id = setInterval(
      () => setTime(getTimeLeft(endDate)),
      FLASH_SALE_CONSTANTS.COUNTDOWN_INTERVAL
    );
    return () => clearInterval(id);
  }, [endDate]);

  if (!time || time.expired) {
    return (
      <span className="text-white/40 text-xs font-medium uppercase tracking-widest">
        {FLASH_SALE_MESSAGES.ENDED}
      </span>
    );
  }

  return (
    <div className="flex gap-2.5 items-center">
      {[
        { v: time.hours, l: "Giờ" },
        { v: time.minutes, l: "Phút" },
        { v: time.seconds, l: "Giây" },
      ].map((b, i) => (
        <React.Fragment key={b.l}>
          {i > 0 && <span className="text-white/30 text-3xl font-serif mb-6">:</span>}
          <div className="bg-white/10 border border-white/12 rounded-[14px] p-4 md:p-5 text-center min-w-[72px] md:min-w-[80px] backdrop-blur-md">
            <span className="block font-serif text-3xl md:text-4xl text-white font-semibold leading-none">
              {pad(b.v)}
            </span>
            <span className="block text-[10px] text-white/50 uppercase tracking-widest mt-1.5">
              {b.l}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
