"use client";

import React, { useMemo } from "react";
import { useFlashSale } from "@/features/discounts/hooks/queries/useFlashSale";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { ShoppingBag, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { Skeleton } from "@/components/ui/Skeleton";
import { getSessionStatus, CAT_ICONS } from "../../utils/flashSaleUtils";
import { useFlashSaleFilter } from "../../hooks/useFlashSaleFilter";

import { FlashSaleHero } from "@/features/discounts/components/customer/flash-sale/FlashSaleHero";
import { FlashSaleProductCard } from "@/features/discounts/components/customer/flash-sale/FlashSaleProductCard";
import { FlashSaleSessionBar } from "@/features/discounts/components/customer/flash-sale/FlashSaleSessionBar";

export function FlashSaleView() {
  const { data: sessions, isLoading } = useFlashSale();
  const { success } = useToast();

  const {
    activeSessionId,
    setActiveSessionId,
    activeSession,
    sortedSessions,
    filteredProducts,
    categories,
    filterCat,
    setFilterCat,
    sortBy,
    setSortBy,
    nextSession,
    products,
  } = useFlashSaleFilter(sessions || []);

  const status = activeSession
    ? getSessionStatus(activeSession.startDate, activeSession.endDate)
    : "ENDED";

  const totalStats = useMemo(() => {
    let totalSold = 0;
    let totalStock = 0;
    products.forEach((p: any) => {
      totalSold += p.soldCount || 0;
      totalStock += (p.stockLimit || 0) + (p.soldCount || 0);
    });
    return {
      soldPercent: Math.round((totalSold / Math.max(1, totalStock)) * 100),
      count: products.length,
    };
  }, [products]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-12">
        <Skeleton className="h-[450px] w-full max-w-[1440px] rounded-3xl mb-12" />
        <div className="grid grid-cols-4 gap-8 w-full max-w-[1440px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream font-sans-brand text-[#2A2420]">
      <FlashSaleHero
        activeSession={activeSession}
        status={status}
        totalStats={totalStats}
      />

      <FlashSaleSessionBar
        sessions={sortedSessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
      />

      <main className="max-w-[1440px] mx-auto px-12 py-10">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <button
              onClick={() => setFilterCat("Tất cả")}
              className={cn(
                "px-5 py-2.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-2",
                filterCat === "Tất cả"
                  ? "bg-gradient-to-r from-[#E8320A] to-[#FF6B35] text-white shadow-md"
                  : "bg-white border border-brand-sand text-brand-taupe hover:border-brand-bronze"
              )}
            >
              {CAT_ICONS["Tất cả"] || "🔥"} Tất cả
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-[13px] font-medium transition-all flex items-center gap-2 bg-white border",
                  filterCat === cat
                    ? "border-[#E8320A] text-[#E8320A] bg-[#FFF5F5] font-bold"
                    : "border-brand-sand text-brand-taupe hover:border-brand-bronze"
                )}
              >
                <span className="text-[14px]">{CAT_ICONS[cat] || "✨"}</span> {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="text-[13px] text-brand-taupe">
              Hiển thị <strong>{filteredProducts.length}</strong> /{" "}
              <strong>{totalStats.count}</strong> sản phẩm
            </div>
            <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
              <SelectTrigger className="h-[42px] px-3.5 bg-white border border-brand-sand rounded-[10px] text-[13px] font-medium text-brand-espresso outline-none cursor-pointer hover:border-brand-bronze transition-all min-w-[180px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent className="rounded-[10px] border-brand-sand">
                <SelectItem value="Giảm nhiều nhất" className="text-[13px]">
                  Giảm nhiều nhất
                </SelectItem>
                <SelectItem value="Giá thấp nhất" className="text-[13px]">
                  Giá thấp nhất
                </SelectItem>
                <SelectItem value="Bán chạy nhất" className="text-[13px]">
                  Bán chạy nhất
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p: any) => (
              <FlashSaleProductCard
                key={p.id}
                product={p}
                session={activeSession}
                nextSession={nextSession}
              />
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className="relative mb-6 inline-block">
                <div className="absolute inset-0 bg-[#E8320A]/5 blur-[40px] rounded-full scale-150" />
                <div className="relative w-24 h-24 bg-white border-2 border-brand-sand rounded-[24px] flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-500">
                  <ShoppingBag size={36} className="text-[#DDD6C8]" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#3D2B1A] mb-3 font-serif-brand">
                Flash Sale đang tạm nghỉ
              </h3>
              <p className="text-[#8A7966] text-sm max-w-md mx-auto italic">
                Các chương trình ưu đãi bùng nổ đang được chúng tôi chuẩn bị kỹ lưỡng.
                Vui lòng quay lại sau!
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-[#3D2B1A] py-16 px-12 text-center text-[#F0D5BB]/60 mt-12">
        <p className="text-sm mb-2">
          © 2026 LUXE Flash Sale Service. Bảo chứng hàng chính hãng.
        </p>
      </footer>
    </div>
  );
}
