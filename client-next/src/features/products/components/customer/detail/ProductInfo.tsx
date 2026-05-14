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
    <div className="flex items-center gap-3">
      {[
        { val: time.days, label: "Ngày" },
        { val: time.hours, label: "Giờ" },
        { val: time.minutes, label: "Phút" },
        { val: time.seconds, label: "Giây" }
      ].map((item, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <span className="text-[14px] font-bold text-primary tabular-nums leading-none mb-1">{pad(item.val)}</span>
            <span className="text-[9px] font-bold text-brand-taupe uppercase tracking-[0.1em]">{item.label}</span>
          </div>
          {i < 3 && <span className="text-brand-ivory font-light self-start mt-0.5">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export function ProductInfo({ product, flashSale, finalPrice, finalOriginalPrice }: ProductInfoProps) {
  const isFlashSale = flashSale?.products?.some((p) => String(p.id) === String(product.id));
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

        <h1 className="text-[28px] md:text-[34px] font-bold text-primary leading-[1.2] tracking-tight font-serif">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] font-bold text-brand-taupe/90">
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

      <div className="pt-8 border-t border-brand-ivory space-y-8">
        <div className="flex flex-col gap-3">
          {isFlashSale && (
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-brand-bronze text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5">
                <Zap size={11} fill="currentColor" /> Flash Sale
              </span>
              <span className="text-brand-bronze text-[13px] font-bold">Tiết kiệm {flashSalePercent}%</span>
            </div>
          )}
          
          <div className="flex items-baseline gap-5">
            <span className="text-[40px] font-bold tabular-nums leading-none text-primary font-serif">
              {formatCurrency(finalPrice)}
            </span>
            {finalOriginalPrice && finalOriginalPrice > finalPrice && (
              <span className="text-[18px] text-brand-taupe/80 line-through font-medium tabular-nums">
                {formatCurrency(finalOriginalPrice)}
              </span>
            )}
          </div>
        </div>

        {isFlashSale && flashSale?.endDate && (
          <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-brand-ivory max-w-sm">
            <div className="text-[11px] font-bold text-brand-taupe">
              Kết thúc sau
            </div>
            <ProductCountdown endDate={flashSale.endDate} />
          </div>
        )}
      </div>

    </div>
  );
}
