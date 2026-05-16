"use client";

import React, { useMemo } from "react";
import { useFlashSale } from "@/features/discounts/hooks";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { ShoppingBag, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { Skeleton } from "@/components/ui/Skeleton";
import { getSessionStatus, CAT_ICONS } from "../../utils/flashSaleUtils";
import { useFlashSaleFilter } from "../../hooks/useFlashSaleFilter";

// Components
import { FlashSaleHero } from "./FlashSale/FlashSaleHero";
import { FlashSaleSessionBar } from "./FlashSale/FlashSaleSessionBar";
import { FlashSaleProductCard } from "./FlashSale/FlashSaleProductCard";

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
    products
  } = useFlashSaleFilter(sessions || []);

  const status = activeSession ? getSessionStatus(activeSession.startDate, activeSession.endDate) : "ENDED";

  const totalStats = useMemo(() => {
    let totalSold = 0;
    let totalStock = 0;
    products.forEach((p: any) => {
      totalSold += p.soldCount || 0;
      totalStock += (p.stockLimit || 0) + (p.soldCount || 0);
    });
    return {
      soldPercent: Math.round((totalSold / Math.max(1, totalStock)) * 100),
      count: products.length
    };
  }, [products]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center p-12">
        <Skeleton className="h-[450px] w-full max-w-[1440px] rounded-3xl mb-12" />
        <div className="grid grid-cols-4 gap-8 w-full max-w-[1440px]">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-96 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!activeSession) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center p-12 text-center">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-[#E8320A]/5 blur-[60px] rounded-full scale-150" />
          <div className="relative w-32 h-32 mx-auto bg-white border-2 border-[#DDD6C8] rounded-[32px] flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-500">
             <ShoppingBag size={48} className="text-[#DDD6C8]" />
          </div>
        </div>
        <h2 className="font-serif text-4xl font-bold text-[#3D2B1A] mb-4 tracking-tight">Flash Sale đang tạm nghỉ</h2>
        <p className="text-[#8A7966] max-w-lg mx-auto mb-10 leading-relaxed text-lg italic">
          Các chương trình ưu đãi bùng nổ đang được chúng tôi chuẩn bị kỹ lưỡng.
        </p>
        <Link href="/shop">
          <Button className="bg-[#3D2B1A] hover:bg-[#E8320A] text-white px-10 h-14 rounded-[16px] font-bold shadow-xl">
            Khám phá Cửa hàng
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] font-sans text-[#2A2420]">
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
        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <button 
              onClick={() => setFilterCat("Tất cả")}
              className={cn(
                "px-5 py-2.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-2",
                filterCat === "Tất cả" 
                  ? "bg-gradient-to-r from-[#E8320A] to-[#FF6B35] text-white shadow-md" 
                  : "bg-white border border-[#DDD6C8] text-[#8A7966] hover:border-[#C4B49A]"
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
                    : "border-[#DDD6C8] text-[#8A7966] hover:border-[#C4B49A]"
                )}
              >
                <span className="text-[14px]">{CAT_ICONS[cat] || "✨"}</span> {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="text-[13px] text-[#8A7966]">
              Hiển thị <strong>{filteredProducts.length}</strong> / <strong>{totalStats.count}</strong> sản phẩm
            </div>
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-[42px] pl-[14px] pr-[38px] bg-white border border-[#DDD6C8] rounded-[10px] text-[13px] font-medium text-[#3D2B1A] outline-none appearance-none cursor-pointer hover:border-[#C4B49A] transition-all min-w-[180px]"
              >
                <option value="Giảm nhiều nhất">🔥 Giảm nhiều nhất</option>
                <option value="Giá thấp nhất">💰 Giá thấp nhất</option>
                <option value="Bán chạy nhất">⚡ Bán chạy nhất</option>
              </select>
              <ChevronDown className="absolute right-[12px] top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A7966] pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
          {filteredProducts.map((p: any) => (
            <FlashSaleProductCard 
              key={p.id} 
              product={p} 
              session={activeSession} 
              nextSession={nextSession}
            />
          ))}
        </div>
      </main>

      <footer className="bg-[#3D2B1A] py-16 px-12 text-center text-[#F0D5BB]/60 mt-12">
        <p className="text-sm mb-2">© 2026 LUXE Flash Sale Service. Bảo chứng hàng chính hãng.</p>
      </footer>
    </div>
  );
}