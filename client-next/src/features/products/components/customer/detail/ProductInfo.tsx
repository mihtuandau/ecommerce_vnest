"use client";

import React, { useState, useEffect } from "react";
import { Star, Zap } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { getTimeLeft } from "@/utils/formatDate";
import { cn } from "@/utils/cn";
import Link from "next/link";

import { Product } from "@/types/models";

interface ProductInfoProps {
  product: Product;
  flashSale?: {
    id: number;
    name: string;
    percentage: number;
    endDate: string;
    products: { id: number | string }[];
  } | null;
  finalPrice: number;
  finalOriginalPrice?: number | null;
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
            <span className="text-sm font-bold text-slate-900 tabular-nums">{pad(item.val)}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
          </div>
          {i < 3 && <span className="text-slate-200 font-medium">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export function ProductInfo({ product, flashSale, finalPrice, finalOriginalPrice }: ProductInfoProps) {
  const isFlashSale = flashSale?.products?.some((p) => String(p.id) === String(product.id));
  const flashSalePercent = isFlashSale ? (flashSale!.percentage || 0) : 0;

  return (
    <div className="space-y-5">
      <div className="space-y-2.5">
        <Link 
          href={`/shop?categoryId=${product.categoryId}`}
          className="inline-block text-[10px] font-bold text-primary uppercase tracking-[0.15em] px-3 py-1 bg-primary/5 rounded-full border border-primary/10 hover:bg-primary/10 transition-all"
        >
          {product.category?.name || "Danh mục"}
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight tracking-tight">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-1.5 no-uppercase">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("h-3 w-3", i < Math.floor(product.averageRating || product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-100")} />
              ))}
            </div>
            <span className="text-slate-900 font-bold ml-0.5">{(product.averageRating || product.rating || 0).toFixed(1)}</span>
          </div>
          <span className="h-2 w-px bg-slate-100" />
          <span className="hover:text-slate-600 transition-colors">{product.reviewCount || 0} Đánh giá</span>
          <span className="h-2 w-px bg-slate-100" />
          <span className="hover:text-slate-600 transition-colors">{product.soldCount || 0} Đã bán</span>
          <span className="h-2 w-px bg-slate-100" />
          <span className="hover:text-slate-600 transition-colors">{product.viewCount || 0} Lượt xem</span>
        </div>
      </div>

      {/* Pricing Box */}
      <div className={cn(
        "p-5 rounded-xl space-y-5",
        isFlashSale ? "bg-[#FFF5F1]/50 border border-[#FFD9C9]" : "bg-slate-50/50 border border-slate-100"
      )}>
        <div className="space-y-3">
          {isFlashSale && (
            <div className="inline-flex items-center gap-1.5 bg-[#E85D24] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-rose-500/10">
              <Zap className="h-3 w-3 fill-current" /> Flash Sale · -{flashSalePercent}%
            </div>
          )}

          <div className="flex items-baseline gap-3">
            <span className={cn(
              "text-3xl font-bold tracking-tight tabular-nums",
              isFlashSale ? "text-[#E85D24]" : "text-slate-900"
            )}>
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
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#E85D24]/60">
              Kết thúc sau
            </div>
            <ProductCountdown endDate={flashSale.endDate} />
          </div>
        )}
      </div>
    </div>
  );
}
