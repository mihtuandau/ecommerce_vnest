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

  const labels = ["Ngày", "Giờ", "Phút", "Giây"].slice(time.days > 0 ? 0 : 1);

  return (
    <div className="flex items-center gap-3">
      {blocks.map((v, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-2xl font-bold text-[#FAF8F4] font-sans">:</span>}
          <div className="bg-white/10 px-4 py-3 rounded-xl text-center min-w-[70px]">
            <span className="block text-2xl md:text-[28px] font-bold text-[#FAF8F4] font-sans">
              {pad(v)}
            </span>
            <span className="block text-[10px] uppercase tracking-widest mt-1 text-[#FAF8F4]/60">
              {labels[i]}
            </span>
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
    <div className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[#DDD6C8] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(61,43,26,0.1)] transition-all duration-300">
      <Link href={`/shop/${product.slug}`} className="absolute inset-0 z-20">
        <span className="sr-only">Xem chi tiết {product.name}</span>
      </Link>

      {/* ── IMAGE SECTION ── */}
      <div className="relative h-[240px] w-full flex items-center justify-center overflow-hidden bg-white border-b border-[#F3EFE8]">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-contain p-6 transition-transform duration-500 ease-in-out group-hover:scale-105 mix-blend-multiply"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        
        <div className="absolute top-3 left-3 z-30">
          <span className="bg-[#C4783A] text-white text-[10px] font-medium tracking-[0.08em] px-2.5 py-1 rounded-full uppercase">
            -{discountPercent}%
          </span>
        </div>
      </div>

      {/* ── CONTENT SECTION ── */}
      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-5">
        <h3 className="text-[14.5px] font-medium text-[#3D2B1A] mb-2 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center text-[#C4783A] text-[12px] tracking-[2px]">
            ★★★★★
          </div>
          <span className="text-[11px] text-[#8A7966]">({soldCount})</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[18px] font-semibold text-[#3D2B1A] font-sans">
              {formatCurrency(salePrice)}
            </span>
            <span className="text-[12px] text-[#8A7966] line-through hidden sm:block">
              {formatCurrency(originalPrice)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 pt-4 border-t border-[#DDD6C8] space-y-1.5">
          <div className="relative h-1.5 bg-[#E8E0D0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C4783A] rounded-full relative"
              style={{ width: `${soldPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#8A7966] uppercase tracking-widest">
            <span>{soldPercent > 80 ? "Sắp cháy hàng" : "Đã bán"}</span>
            <span>{soldCount} / {totalStock}</span>
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
    <section className="w-full bg-[#2A2420] text-[#FAF8F4] py-12 md:py-16 my-8 md:my-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 mb-10 md:mb-12">
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-[32px] md:text-[36px] font-serif-brand font-semibold">
            Flash <em className="text-[#C4783A]" style={{ fontStyle: 'italic' }}>Sale</em>
          </h2>
          <p className="text-[14px] text-[#FAF8F4]/70 max-w-sm leading-relaxed hidden md:block">
            Giảm giá lên đến {data.percentage}% cho hàng ngàn sản phẩm. Cơ hội có một không hai — số lượng có hạn!
          </p>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <CountdownTimer endDate={data.endDate} />
        </div>

        <Link 
          href="/flash-sale" 
          className="bg-[#C4783A] text-white px-8 py-3.5 rounded-full text-[13.5px] font-medium hover:bg-[#B56830] transition-colors whitespace-nowrap"
        >
          Xem ưu đãi →
        </Link>
      </div>

      {/* Products */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
