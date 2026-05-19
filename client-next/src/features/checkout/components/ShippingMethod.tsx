"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";
import { Spinner } from "@/components/ui/Spinner";
import { CheckoutCard } from "./CheckoutCard";

interface ShippingMethodProps {
  shippingFee: number;
  isCalculatingFee: boolean;
  stepNumber?: number | string;
}

export function ShippingMethod({
  shippingFee,
  isCalculatingFee,
  stepNumber = "2",
}: ShippingMethodProps) {
  return (
    <CheckoutCard step={stepNumber} title="Phương thức vận chuyển">
      <label className="border-[1.5px] border-primary bg-brand-ivory rounded-[12px] p-4 cursor-pointer flex items-center gap-[14px] transition-all ring-1 ring-primary/20 shadow-sm">
        <div className="w-4 h-4 rounded-full border border-primary bg-primary flex items-center justify-center shrink-0 transition-all">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-in zoom-in-50 duration-200" />
        </div>
        <span className="text-[22px]">🚀</span>
        <div className="flex-1">
          <div className="text-[13.5px] font-bold text-primary mb-[1px]">
            Giao hàng tiêu chuẩn
          </div>
          <div className="text-[12px] text-brand-taupe">
            Dự kiến nhận hàng trong 2–4 ngày
          </div>
        </div>
        <span
          className={cn(
            "text-[14px] font-bold",
            shippingFee === 0 ? "text-emerald-600" : "text-primary"
          )}
        >
          {isCalculatingFee ? (
            <Spinner size="sm" />
          ) : shippingFee === 0 ? (
            "Miễn phí"
          ) : (
            formatCurrency(shippingFee)
          )}
        </span>
      </label>
    </CheckoutCard>
  );
}
