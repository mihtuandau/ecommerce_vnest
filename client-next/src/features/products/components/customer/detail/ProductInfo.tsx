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
        { val: time.days, label: "Ngày" },
        { val: time.hours, label: "Giờ" },
        { val: time.minutes, label: "Phút" },
        { val: time.seconds, label: "Giây" }
      ].slice(time.days > 0 ? 0 : 1).map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-[14px] font-bold text-brand-bronze animate-pulse mb-3">:</span>}
          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm border border-brand-sand/30">
              <span className="text-[15px] font-bold text-brand-espresso tabular-nums leading-none">{pad(item.val)}</span>
            </div>
            <span className="text-[8px] font-extrabold text-brand-taupe uppercase tracking-wider">{item.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export function ProductInfo({ product, flashSale, finalPrice, finalOriginalPrice }: ProductInfoProps) {
  const isFlashSale = flashSale?.products?.some((p: any) => 
    String(p.id) === String(product.id) || 
    String(p.productId) === String(product.id)
  );
  const flashSalePercent = isFlashSale ? (flashSale!.percentage || 0) : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Link 
          href={`/shop?categoryId=${product.categoryId}`}
          className="inline-block text-[12px] font-bold text-brand-bronze hover:text-primary transition-colors"
        >
          {product.category?.name || "Bộ sưu tập LUXE"}
        </Link>

        <h1 className="text-[24px] md:text-[30px] font-bold text-primary leading-[1.2] tracking-tight">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-bold text-brand-taupe/90">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-brand-bronze gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className={cn(i < Math.floor(product.averageRating || 5) ? "fill-current" : "opacity-30")} />
              ))}
            </div>
            <span className="text-primary ml-0.5">{(product.averageRating || 5).toFixed(1)}</span>
          </div>
          <span className="h-3 w-px bg-brand-ivory" />
          <span>{product.reviewCount || 0} đánh giá</span>
          <span className="h-3 w-px bg-brand-ivory" />
          <span>{product.soldCount || 0} đã bán</span>
        </div>
      </div>

      <div className="pt-8 border-t border-brand-ivory space-y-6">
        <div className="flex flex-col gap-3">
          {isFlashSale && (
            <div className="flex items-center gap-2.5">
              <div className="bg-red-500 text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                <Zap size={11} fill="currentColor" /> Flash Sale
              </div>
              <div className="bg-brand-bronze/10 text-brand-bronze px-3 py-1 rounded-md text-[11px] font-bold">
                Tiết kiệm {flashSalePercent}%
              </div>
            </div>
          )}
          
          <div className="flex items-baseline gap-4">
            <span className="text-[36px] font-bold tabular-nums leading-none text-brand-espresso">
              {formatCurrency(finalPrice)}
            </span>
            {finalOriginalPrice && finalOriginalPrice > finalPrice && (
              <span className="text-[18px] text-brand-taupe/60 line-through font-medium tabular-nums">
                {formatCurrency(finalOriginalPrice)}
              </span>
            )}
          </div>
        </div>
 
        {isFlashSale && flashSale?.endDate && (
          <div className="flex items-center justify-between p-5 bg-brand-espresso rounded-[28px] border border-brand-bronze/30 shadow-[0_20px_40px_rgba(61,43,26,0.15)] relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-bronze/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="flex flex-col gap-1.5 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[11px] font-bold text-brand-sand uppercase tracking-[0.15em]">Sắp kết thúc</span>
              </div>
              <span className="text-[12px] font-medium text-brand-ivory/80">Đừng bỏ lỡ ưu đãi này</span>
            </div>
            
            <div className="relative z-10">
              <ProductCountdown endDate={flashSale.endDate} />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
