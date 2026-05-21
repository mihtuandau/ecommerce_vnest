"use client";

import { Sparkles, Star, TrendingUp } from "lucide-react";
import { ProductSection } from "@/features/home/components/customer/sections/ProductSection";
import { ProductSectionSkeleton } from "@/features/home/components/customer/skeletons/HomeSkeletons";
import type { Product } from "@/types/models";

interface HomeProductShowcaseProps {
  bestSellingProducts: Product[];
  featuredProducts: Product[];
  topRatedProducts: Product[];
  isBestSellingLoading: boolean;
  isFeaturedLoading: boolean;
  isTopRatedLoading: boolean;
}

export function HomeProductShowcase({
  bestSellingProducts,
  featuredProducts,
  topRatedProducts,
  isBestSellingLoading,
  isFeaturedLoading,
  isTopRatedLoading,
}: HomeProductShowcaseProps) {
  return (
    <>
      <section className="w-full">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {isBestSellingLoading ? (
            <ProductSectionSkeleton variant="bestseller" />
          ) : (
            <ProductSection
              title="Sản phẩm bán chạy"
              subtitle="Những thiết kế được yêu thích nhất."
              products={bestSellingProducts}
              icon={TrendingUp}
              variant="bestseller"
              viewAllLink="/shop?sortBy=sold"
            />
          )}
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
        {isFeaturedLoading ? (
          <ProductSectionSkeleton variant="featured" />
        ) : (
          <ProductSection
            title="Mới về"
            subtitle="Gợi ý dành riêng cho bạn."
            products={featuredProducts}
            icon={Sparkles}
            variant="featured"
            viewAllLink="/shop?sortBy=newest"
          />
        )}
      </section>

      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full pb-8">
        {isTopRatedLoading ? (
          <ProductSectionSkeleton variant="toprated" />
        ) : (
          <ProductSection
            title="Đánh giá cao"
            subtitle="Những sản phẩm chất lượng nhất."
            products={topRatedProducts}
            icon={Star}
            variant="toprated"
            viewAllLink="/shop?sortBy=rating"
          />
        )}
      </section>
    </>
  );
}
