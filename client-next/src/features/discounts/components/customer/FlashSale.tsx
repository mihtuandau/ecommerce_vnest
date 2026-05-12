"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Product } from "@/types/models";
import { getTimeLeft } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { getImageUrl } from "@/utils/image";

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

function FlashProductCard({ product: rawProduct, discountPercent }: { product: any; discountPercent: number }) {
  const product = rawProduct.product || rawProduct;
  
  let images = product.images;
  if (typeof images === 'string') {
    try { images = JSON.parse(images); } catch (e) { images = []; }
  }

  const rawImage = Array.isArray(images) ? images[0] : (product.image || null);
  const rawPath = typeof rawImage === "string" 
    ? rawImage 
    : (rawImage as any)?.url || (rawImage as any)?.image || (rawImage as any)?.imageUrl;
  
  const imageUrl = getImageUrl(rawPath);

  const originalPrice = product.basePrice || 0;
  const salePrice = Math.round(originalPrice * (1 - discountPercent / 100));

  const soldCount = rawProduct.sold ?? product.soldCount ?? 0;
  const variantsStock = product.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;
  const currentStock = rawProduct.stock ?? ((product.stock || 0) > 0 ? product.stock : variantsStock);
  const totalStock = rawProduct.totalStock || (currentStock + soldCount);
  const soldPercent = Math.min(100, Math.round((soldCount / Math.max(1, totalStock)) * 100));

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-3xl cursor-pointer p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(232,93,36,0.1)] border border-slate-100/50">
      {/* Card-wide Link */}
      <Link href={`/shop/${product.slug}`} className="absolute inset-0 z-20">
        <span className="sr-only">Xem chi tiết {product.name}</span>
      </Link>

      {/* ── IMAGE SECTION ── */}
      <div className="relative z-10 aspect-square w-full overflow-hidden rounded-2xl bg-slate-50/50">
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="h-full w-full object-cover object-center transition-all duration-1000 ease-in-out group-hover:scale-110 group-hover:rotate-2"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="absolute top-2 left-2 z-30">
          <div className="bg-gradient-to-r from-[#E85D24] to-[#ff8a50] text-white text-xs font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-0.5 uppercase tracking-wider">
            <Zap className="h-2.5 w-2.5 fill-current animate-pulse" /> -{discountPercent}%
          </div>
        </div>
      </div>

      {/* ── CONTENT SECTION ── */}
      <div className="relative z-10 mt-3 flex-1 flex flex-col pb-2">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.2rem] flex-1 leading-snug group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex flex-col items-end shrink-0">
            <p className="text-sm font-bold text-[#E85D24] tabular-nums">
              {formatCurrency(salePrice)}
            </p>
            <p className="text-xs text-gray-400 line-through tabular-nums font-medium">
              {formatCurrency(originalPrice)}
            </p>
          </div>
        </div>
        
        {/* Progress bar - Enhanced */}
        <div className="mt-auto space-y-1.5">
          <div className="relative h-1.5 bg-orange-100/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E85D24] via-[#f36b32] to-[#ff8a50] rounded-full relative"
              style={{ width: `${soldPercent}%` }}
            >
               <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:15px_15px] animate-[progress-stripe_1s_linear_infinite]" />
            </div>
          </div>
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
            <span className="text-[#E85D24] flex items-center gap-1">
               <span className="w-1 h-1 rounded-full bg-[#E85D24] animate-pulse" />
               {soldPercent > 80 ? "Sắp cháy" : `Đã bán ${soldCount}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FlashSaleProps {
  data: {
    percentage: number;
    endDate: string;
    products: Product[];
  } | null;
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
                <span className="text-xs text-white/80 font-normal hidden sm:block">Kết thúc</span>
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
          {data.products.slice(0, 4).map((product: Product) => (
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
