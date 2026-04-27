"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { getTimeLeft } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function CountdownTimer({ endDate }: { endDate: string }) {
  const [time, setTime] = useState(() => getTimeLeft(endDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTimeLeft(endDate));
    }, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (!time || time.expired) {
    return <span className="text-xs font-normal text-white/80">Đã kết thúc</span>;
  }

  const blocks = [
    ...(time.days > 0 ? [time.days] : []),
    time.hours, time.minutes, time.seconds
  ];

  return (
    <div className="flex items-center gap-1">
      {blocks.map((v, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-white/30 font-bold text-xs">:</span>}
          <div className="bg-white rounded-lg px-2 py-1.5 min-w-[32px] text-center">
            <span className="text-sm font-bold text-[#E85D24] tabular-nums">{pad(v)}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function FlashProductCard({ product, discountPercent }: { product: any; discountPercent: number }) {
  const imageUrl = product.image || 
    (typeof product.images?.[0] === "string" ? product.images[0] : product.images?.[0]?.url) || 
    "/placeholder.png";

  const originalPrice = product.basePrice || 0;
  const salePrice = Math.round(originalPrice * (1 - discountPercent / 100));

  const soldCount = product.soldCount || 0;
  const currentStock = product.stock || 0;
  const totalStock = currentStock + soldCount;
  const soldPercent = Math.min(100, Math.round((soldCount / Math.max(1, totalStock)) * 100));

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group bg-white rounded-xl overflow-hidden flex flex-col h-full border border-slate-100 hover:shadow-md transition-all duration-300"
    >
      {/* Badge */}
      <div className="absolute top-2 left-2 z-10">
        <div className="bg-[#E85D24] text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5">
          <Zap className="h-2.5 w-2.5 fill-current" /> -{discountPercent}%
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-slate-50 flex items-center justify-center p-4 shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-xs md:text-sm font-semibold text-slate-800 line-clamp-2 mb-2 min-h-[32px] leading-snug group-hover:text-[#E85D24] transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto space-y-2">
          <div>
            <span className="text-sm md:text-base font-bold text-[#E85D24]">
              {formatCurrency(salePrice)}
            </span>
            <span className="text-[10px] text-slate-300 line-through ml-1.5">
              {formatCurrency(originalPrice)}
            </span>
          </div>

          {/* Progress */}
          <div className="space-y-1">
            <div className="h-1.5 bg-orange-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E85D24] to-[#ff8a50] rounded-full"
                style={{ width: `${soldPercent}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-600 font-normal">
              {soldPercent > 80 ? "Sắp hết" : `Đã bán ${soldCount}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface FlashSaleProps {
  data: any;
}

export function FlashSale({ data }: FlashSaleProps) {
  if (!data || !data.percentage || !data.products?.length) return null;

  return (
    <section className="w-full">
      <div className="bg-gradient-to-r from-[#E85D24] to-[#ff8a50] rounded-2xl md:rounded-3xl p-5 md:p-8 relative overflow-hidden shadow-lg">
        {/* Background */}
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 h-72 w-72 bg-white/10 rounded-full blur-3xl" />

        {/* Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-white flex items-center justify-center text-[#E85D24] shadow-sm shrink-0">
              <Zap className="h-5 w-5 md:h-6 md:w-6 fill-current" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white leading-none">
                Flash Sale
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-white/80 font-normal hidden sm:block">Kết thúc</span>
                <CountdownTimer endDate={data.endDate} />
              </div>
            </div>
          </div>

          <Button asChild variant="outline" className="rounded-full h-9 md:h-10 px-5 md:px-6 bg-white/10 border-white/20 text-white hover:bg-white hover:text-[#E85D24] font-semibold text-xs group transition-all w-full sm:w-auto">
            <Link href="/flash-sale" className="flex items-center gap-1.5 justify-center">
              Xem tất cả <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Products */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {data.products.slice(0, 4).map((product: any) => (
            <FlashProductCard
              key={product.id}
              product={product}
              discountPercent={data.percentage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
