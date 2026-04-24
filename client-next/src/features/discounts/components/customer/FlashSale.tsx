"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Flame, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { getTimeLeft } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const TimeBlock = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="w-9 h-9 sm:w-12 sm:h-12 bg-black/20 backdrop-blur-md border border-white/30 flex items-center justify-center rounded-xl shadow-inner">
      <span className="text-lg sm:text-xl font-black text-white tabular-nums leading-none">
        {pad(value)}
      </span>
    </div>
    <span className="text-[7px] md:text-[8px] font-black text-white/80 uppercase tracking-widest mt-1.5">
      {label}
    </span>
  </div>
);

const Colon = () => <span className="text-white/40 text-lg sm:text-xl font-bold pb-4 sm:pb-5">:</span>;

function CountdownTimer({ endDate }: { endDate: string }) {
  const [time, setTime] = useState(() => getTimeLeft(endDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTimeLeft(endDate));
    }, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (!time || time.expired) {
    return <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Đã kết thúc</span>;
  }

  return (
    <div className="flex items-center gap-1.5 md:gap-2">
      {time.days > 0 && (
        <>
          <TimeBlock value={time.days} label="Ngày" />
          <Colon />
        </>
      )}
      <TimeBlock value={time.hours} label="Giờ" />
      <Colon />
      <TimeBlock value={time.minutes} label="Phút" />
      <Colon />
      <TimeBlock value={time.seconds} label="Giây" />
    </div>
  );
}

function FlashProductCard({ product, discountPercent }: { product: any; discountPercent: number }) {
  // Fix: Flash Sale API returns a single 'image' field, while other APIs return 'images' array
  const imageUrl = product.image || 
    (typeof product.images?.[0] === "string" ? product.images[0] : product.images?.[0]?.url) || 
    "/placeholder.png";

  const originalPrice = product.basePrice || 0;
  const salePrice = Math.round(originalPrice * (1 - discountPercent / 100));

  // Sold data logic
  const soldCount = product.soldCount || 0;
  const currentStock = product.stock || 0;
  const totalStock = currentStock + soldCount;
  const soldPercent = Math.min(100, Math.round((soldCount / Math.max(1, totalStock)) * 100));

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative bg-white rounded-xl md:rounded-2xl overflow-hidden flex flex-col h-full border border-white/10 hover:shadow-xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-1"
    >
      {/* Discount Badge */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20">
        <div className="bg-[#1a1a1a] text-white text-[8px] md:text-[10px] font-black px-1.5 py-1 md:px-2.5 md:py-1.5 rounded-lg shadow-lg flex items-center gap-0.5 md:gap-1">
          <Zap className="h-2.5 w-2.5 md:h-3 md:w-3 fill-current text-[#e85d24]" /> -{discountPercent}%
        </div>
      </div>

      {/* Image Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-white flex items-center justify-center p-3 md:p-4 shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
        />
      </div>

      <div className="p-2.5 md:p-3.5 flex flex-col flex-grow bg-white">
        <h3 className="text-[12px] md:text-sm font-bold text-[#1a1a1a] line-clamp-2 mb-1 md:mb-1.5 min-h-[30px] md:min-h-[40px] leading-snug">
          {product.name}
        </h3>

        <div className="mt-auto space-y-2 md:space-y-2.5">
          <div className="flex flex-col xs:flex-row xs:items-baseline gap-0.5 md:gap-2">
            <span className="text-[14px] md:text-lg font-black text-[#e85d24] tabular-nums leading-tight">
              {formatCurrency(salePrice)}
            </span>
            <span className="text-[8px] md:text-[10px] text-[#999] line-through font-bold">
              {formatCurrency(originalPrice)}
            </span>
          </div>

          {/* Progress Bar Area */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[7px] md:text-[8px] font-black tracking-tight">
              <span className="text-[#555] uppercase">Đã bán {soldCount}</span>
              <span className={cn("uppercase", soldPercent > 80 ? "text-[#e85d24] animate-pulse" : "text-[#999]")}>
                {soldPercent > 80 ? "Sắp cháy" : `${soldPercent}%`}
              </span>
            </div>
            <div className="h-1.5 md:h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#e85d24] to-[#ff7d45] rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${soldPercent}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full animate-pulse" />
              </div>
            </div>
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
      <div className="bg-[#e85d24] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 relative overflow-hidden shadow-2xl">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-12">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-white flex items-center justify-center text-[#e85d24] shadow-xl shadow-black/10 shrink-0">
                <Flame className="h-6 w-6 md:h-8 md:w-8 fill-current" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em] text-white/60">
                  Limited Offer
                </span>
                <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                  Flash Sale
                </h2>
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 hidden sm:block">Kết thúc sau</p>
              </div>
            </div>

            <CountdownTimer endDate={data.endDate} />
          </div>

          <Button asChild variant="outline" className="rounded-full h-10 md:h-12 px-6 md:px-8 bg-white/10 border-white/20 text-white hover:bg-white hover:text-[#e85d24] font-bold uppercase tracking-widest text-[9px] md:text-[10px] group transition-all w-full sm:w-auto">
            <Link href="/flash-sale" className="flex items-center gap-2 justify-center">
              XEM TẤT CẢ <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
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
