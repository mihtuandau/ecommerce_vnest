import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";

interface PriceProps {
  amount: number;
  originalAmount?: number;
  showBadge?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Price({
  amount,
  originalAmount,
  showBadge = false,
  size = "md",
  className,
}: PriceProps) {
  const hasDiscount = originalAmount !== undefined && originalAmount > amount;
  const discountPercentage = hasDiscount
    ? Math.round(((originalAmount! - amount) / originalAmount!) * 100)
    : 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-2 font-sans tabular-nums select-none", className)}>
      <span
        className={cn(
          "font-bold text-brand-espresso",
          {
            "text-[13.5px]": size === "sm",
            "text-[15.5px]": size === "md",
            "text-[18px]": size === "lg",
            "text-[22px]": size === "xl",
          }
        )}
      >
        {formatCurrency(amount)}
      </span>

      {hasDiscount && (
        <>
          <span
            className={cn(
              "text-brand-taupe/70 line-through font-medium decoration-brand-taupe/40",
              {
                "text-[11px]": size === "sm",
                "text-[12.5px]": size === "md",
                "text-[14px]": size === "lg" || size === "xl",
              }
            )}
          >
            {formatCurrency(originalAmount!)}
          </span>

          {showBadge && discountPercentage > 0 && (
            <span
              className={cn(
                "font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-1.5 py-0.5",
                {
                  "text-[9px]": size === "sm",
                  "text-[10px]": size === "md",
                  "text-[11px] font-extrabold": size === "lg" || size === "xl",
                }
              )}
            >
              -{discountPercentage}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
