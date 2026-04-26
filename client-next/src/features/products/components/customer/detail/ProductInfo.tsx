"use client";

import React, { useState, useEffect } from "react";
import { Star, Zap } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { getTimeLeft } from "@/utils/formatDate";
import { cn } from "@/utils/cn";
import Link from "next/link";

interface ProductInfoProps {
  product: any;
  flashSale?: any;
  finalPrice: number;
  finalOriginalPrice: number | null;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function ProductCountdown({ endDate }: { endDate: string }) {
  const [time, setTime] = useState(() => getTimeLeft(endDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTimeLeft(endDate));
    }, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (!time || time.expired) return null;

  return (
    <div className="flex items-center gap-2">
      {[
        { val: time.days, label: "n" },
        { val: time.hours, label: "g" },
        { val: time.minutes, label: "p" },
        { val: time.seconds, label: "s" }
      ].map((item, i) => (
        <React.Fragment key={i}>
          <div className="flex items-baseline gap-0.5">
            <span className="text-sm font-semibold text-slate-900 tabular-nums">{pad(item.val)}</span>
            <span className="text-[9px] font-semibold text-slate-400 uppercase">{item.label}</span>
          </div>
          {i < 3 && <span className="text-slate-200 font-medium">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export function ProductInfo({ product, flashSale, finalPrice, finalOriginalPrice }: ProductInfoProps) {
  const isFlashSale = flashSale?.products?.some((p: any) => String(p.id) === String(product.id));
  const flashSalePercent = isFlashSale ? (flashSale.percentage || 0) : 0;

  return (
    <div className="space-y-5">
      <div className="space-y-2.5">
        <Link 
          href={`/shop?categoryId=${product.categoryId}`}
          className="inline-block text-[10px] font-semibold text-primary/80 px-2 py-0.5 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
        >
          {product.category?.name || "Danh mục"}
        </Link>

        <h1 className="text-xl md:text-2xl font-semibold text-slate-900 leading-tight">
          {product.name}
        </h1>

        <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("h-3 w-3", i < Math.floor(product.averageRating || product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-200")} />
              ))}
            </div>
            <span className="text-slate-900 font-semibold ml-1">{(product.averageRating || product.rating || 0).toFixed(1)}</span>
          </div>
          <span className="h-3 w-px bg-slate-200" />
          <span>{product.reviewCount || 0} đánh giá</span>
          <span className="h-3 w-px bg-slate-200" />
          <span>{product.soldCount || 0} đã bán</span>
          <span className="h-3 w-px bg-slate-200" />
          <span>{product.viewCount || 0} lượt xem</span>
        </div>
      </div>

      {/* Pricing Box */}
      <div className={cn(
        "p-5 rounded-xl space-y-5",
        isFlashSale ? "bg-rose-50/50 border border-rose-100" : "bg-slate-50/50 border border-slate-100"
      )}>
        <div className="space-y-3">
          {isFlashSale && (
            <div className="inline-flex items-center gap-1.5 bg-rose-500 text-white px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider">
              <Zap className="h-3 w-3 fill-current" /> FLASH SALE · -{flashSalePercent}%
            </div>
          )}

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-rose-500 tracking-tight tabular-nums">
              {formatCurrency(finalPrice)}
            </span>
            {finalOriginalPrice && finalOriginalPrice > finalPrice && (
              <span className="text-sm text-slate-500 line-through font-semibold">
                {formatCurrency(finalOriginalPrice)}
              </span>
            )}
          </div>
        </div>

        {isFlashSale && flashSale?.endDate && (
          <div className="flex items-center gap-4 pt-3 border-t border-rose-100/50">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-500/60 uppercase">
              Kết thúc sau
            </div>
            <ProductCountdown endDate={flashSale.endDate} />
          </div>
        )}
      </div>
    </div>
  );
}
