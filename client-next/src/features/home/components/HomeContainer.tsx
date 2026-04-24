"use client";

import React from "react";
import { HeroBanner } from "@/features/banners/components/customer/HeroBanner";
import { TrustBadges } from "./TrustBadges";
import { ProductSection } from "./ProductSection";
import { FlashSale } from "@/features/discounts/components/customer/FlashSale";
import { FeaturedCategories } from "./FeaturedCategories";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ChevronRight, Loader2, Sparkles, TrendingUp, Star } from "lucide-react";
import { useBanners } from "@/features/banners/hooks";
import { useFlashSale } from "@/features/discounts/hooks";
import { useProducts } from "@/features/products/hooks";

export default function HomeContainer() {
  // Banners
  const { data: bannerData, isLoading: isBannersLoading } = useBanners({ active: "true" });
  
  // Flash Sale
  const { data: flashSale } = useFlashSale();
  
  // Featured (Newest)
  const { data: featuredData, isLoading: isFeaturedLoading } = useProducts({ limit: "4", sortBy: "newest" });
  
  // Best Selling
  const { data: bestSellingData, isLoading: isBestSellingLoading } = useProducts({ limit: "4", sortBy: "sold" });
  
  // Top Rated
  const { data: topRatedData, isLoading: isTopRatedLoading } = useProducts({ limit: "4", sortBy: "rating" });

  const banners = bannerData?.data || bannerData || [];
  const featuredProducts = featuredData?.data || [];
  const bestSellingProducts = bestSellingData?.data || [];
  const topRatedProducts = topRatedData?.data || [];

  const isLoading = isBannersLoading || isFeaturedLoading || isBestSellingLoading || isTopRatedLoading;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang tải trải nghiệm của bạn...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-12 md:pb-20 bg-background">
      {/* ── Hero Banner ── */}
      <HeroBanner banners={Array.isArray(banners) ? banners : []} />

      <div className="space-y-16 md:space-y-24 mt-12 md:mt-20">
        {/* ── Featured Categories ── */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <FeaturedCategories />
        </section>

        {/* ── Flash Sale ── */}
        {flashSale && (
          <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <FlashSale data={flashSale} />
          </section>
        )}

        {/* ── Best Selling Products ── */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <ProductSection 
            title="Bán chạy" 
            subtitle="Sản phẩm được yêu thích nhất."
            products={bestSellingProducts} 
            icon={TrendingUp}
            iconColor="text-[#1a1a1a]"
            iconBg="bg-slate-100"
            variant="bestseller"
            viewAllLink="/shop?sortBy=sold"
          />
        </section>

        {/* ── Featured Products ── */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <ProductSection 
            title="Mới về" 
            subtitle="Gợi ý dành riêng cho bạn."
            products={featuredProducts} 
            icon={Sparkles}
            iconColor="text-[#1a1a1a]"
            iconBg="bg-slate-100"
            variant="featured"
            viewAllLink="/shop?sortBy=newest"
          />
        </section>

        {/* ── Top Rated Products ── */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <ProductSection 
            title="Đánh giá cao" 
            subtitle="Những sản phẩm chất lượng nhất."
            products={topRatedProducts} 
            icon={Star}
            iconColor="text-[#1a1a1a]"
            iconBg="bg-slate-100"
            variant="toprated"
            viewAllLink="/shop?sortBy=rating"
          />
        </section>

      </div>

      {/* ── Call to Action ── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
        <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-slate-900 px-6 py-12 md:px-20 md:py-24 text-center shadow-2xl">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4 md:space-y-6">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-primary/80 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
              Vnest Collection 2025
            </span>
            <h2 className="text-2xl md:text-5xl font-black text-white tracking-tight leading-[1.2] md:leading-[1.1]">
              Kiến tạo không gian<br className="hidden sm:block" /> hiện đại cùng Vnest
            </h2>
            <p className="text-slate-400 text-sm md:text-lg max-w-lg mx-auto leading-relaxed font-medium">
              Sở hữu ngay những thiết kế công nghệ và gia dụng đẳng cấp bậc nhất hiện nay.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button asChild size="lg" className="rounded-full px-10 h-12 text-sm font-bold shadow-lg shadow-primary/30 w-full sm:w-auto">
                <Link href="/shop">Mua sắm ngay</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="rounded-full px-10 h-12 text-sm text-slate-300 hover:text-white hover:bg-white/5 w-full sm:w-auto">
                <Link href="/about" className="flex items-center gap-1.5">
                  Về chúng tôi <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
