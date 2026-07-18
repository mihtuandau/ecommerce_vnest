"use client";

import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";

export const ChatDiscountCard = ({ discount }: { discount: any }) => {
  const [copied, setCopied] = useState(false);
  const isFlash = discount.isFlashSale;

  const handleCopy = () => {
    navigator.clipboard.writeText(discount.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-3 border rounded-xl mt-2 relative overflow-hidden group transition-all",
        isFlash ? "bg-red-50/50 border-red-100" : "bg-emerald-50/50 border-emerald-100"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-7 w-7 rounded-lg text-white flex items-center justify-center flex-shrink-0 animate-pulse",
              isFlash ? "bg-red-500" : "bg-emerald-500"
            )}
          >
            <ShoppingCart size={14} />
          </div>
          <div>
            <h4
              className={cn(
                "text-[11px] font-bold uppercase tracking-wider",
                isFlash ? "text-red-700" : "text-emerald-700"
              )}
            >
              {isFlash && "⚡ "}
              {discount.code}
            </h4>
            <p
              className={cn(
                "text-[10px] font-medium",
                isFlash ? "text-red-600/70" : "text-emerald-600/70"
              )}
            >
              Giảm{" "}
              {discount.percentage
                ? `${discount.percentage}%`
                : formatCurrency(discount.fixedAmount)}
            </p>
          </div>
        </div>
        <Button
          onClick={handleCopy}
          className={cn(
            "px-3 py-1 rounded-lg text-[10px] font-bold transition-all h-auto min-h-0",
            copied
              ? isFlash
                ? "bg-red-500 text-white hover:bg-red-650"
                : "bg-emerald-500 text-white hover:bg-emerald-650"
              : isFlash
                ? "bg-white text-red-600 border border-red-200 hover:bg-red-500 hover:text-white"
                : "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-500 hover:text-white"
          )}
        >
          {copied ? "Đã lưu!" : "Sao chép"}
        </Button>
      </div>
      {discount.description && (
        <p className="text-[10px] text-brand-taupe italic leading-tight border-t border-brand-sand pt-2 mt-1">
          {discount.description}
        </p>
      )}
      <div
        className={cn(
          "absolute -right-4 -bottom-4 h-12 w-12 rounded-full",
          isFlash ? "bg-red-500/5" : "bg-emerald-500/5"
        )}
      />
    </div>
  );
};
