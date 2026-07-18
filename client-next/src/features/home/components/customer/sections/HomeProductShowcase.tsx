"use client";

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
              index={3}
              eyebrow="Bán chạy"
              title="Sản phẩm bán chạy nhất"
              accent="bán chạy nhất"
              subtitle="Những thiết kế được yêu thích nhất."
              products={bestSellingProducts}
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
            index={4}
            eyebrow="Mới về"
            title="Vừa cập bến cửa hàng"
            accent="cập bến"
            subtitle="Gợi ý dành riêng cho bạn."
            products={featuredProducts}
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
            index={5}
            eyebrow="Đánh giá cao"
            title="Được khách hàng tin chọn"
            accent="tin chọn"
            subtitle="Những sản phẩm chất lượng nhất."
            products={topRatedProducts}
            variant="toprated"
            viewAllLink="/shop?sortBy=rating"
          />
        )}
      </section>
    </>
  );
}
