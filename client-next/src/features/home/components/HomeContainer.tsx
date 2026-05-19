"use client";

import React from "react";
import { HeroBanner } from "@/features/banners/components/customer/HeroBanner";
import { TrustBadges } from "./sections/TrustBadges";
import { ProductSection } from "./sections/ProductSection";
import { FlashSale } from "@/features/discounts/components/customer/FlashSale";
import { FeaturedCategories } from "./sections/FeaturedCategories";
import { VoucherBanner } from "./sections/VoucherBanner";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ChevronRight, Sparkles, TrendingUp, Star } from "lucide-react";
import {
  HeroBannerSkeleton,
  ProductSectionSkeleton,
  FlashSaleSkeleton,
} from "./skeletons/HomeSkeletons";
import { useBanners } from "@/features/banners/hooks";
import { useFlashSale } from "@/features/discounts/hooks";
import { useProducts } from "@/features/products/hooks";
import { useLatestReviews } from "@/features/reviews/hooks";

export default function HomeContainer() {
  // Banners
  const { data: bannerData, isLoading: isBannersLoading } = useBanners({
    active: "true",
  });

  // Flash Sale
  const { data: flashSale, isLoading: isFlashSaleLoading } = useFlashSale();

  // Featured (Newest)
  const { data: featuredData, isLoading: isFeaturedLoading } = useProducts({
    limit: "4",
    sortBy: "newest",
  });

  // Best Selling
  const { data: bestSellingData, isLoading: isBestSellingLoading } = useProducts({
    limit: "4",
    sortBy: "sold",
  });

  // Top Rated
  const { data: topRatedData, isLoading: isTopRatedLoading } = useProducts({
    limit: "4",
    sortBy: "rating",
  });

  // Reviews
  const { data: reviewsData } = useLatestReviews();

  const banners = bannerData?.data || bannerData || [];
  const featuredProducts = featuredData?.data || [];
  const bestSellingProducts = bestSellingData?.data || [];
  const topRatedProducts = topRatedData?.data || [];

  return (
    <div
      className="flex flex-col bg-brand-cream"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Hero Banner ── */}
      {isBannersLoading ? (
        <HeroBannerSkeleton />
      ) : (
        <HeroBanner banners={Array.isArray(banners) ? banners : []} />
      )}

      {/* ── Trust Badges ── */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full mt-12 md:mt-16">
        <TrustBadges />
      </section>

      <div className="space-y-20 md:space-y-28 mt-16 md:mt-24">
        {/* ── Featured Categories ── */}
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <FeaturedCategories />
        </section>

        {/* ── Flash Sale ── */}
        {isFlashSaleLoading ? (
          <section className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
            <FlashSaleSkeleton />
          </section>
        ) : (
          (() => {
            const sessions = Array.isArray(flashSale) ? flashSale : [];
            if (sessions.length === 0) return null;

            // Backend already filters for active/future sessions.
            // Just pick the one that is most "relevant" (LIVE first, then SOON).
            const now = new Date();
            const activeSession =
              sessions.find((s) => {
                const start = new Date(s.startDate);
                const end = s.endDate ? new Date(s.endDate) : null;
                return start <= now && (!end || end >= now);
              }) || sessions[0]; // Fallback to first session if date check is fuzzy

            return (
              <section className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
                <FlashSale data={activeSession} />
              </section>
            );
          })()
        )}

        {/* ── Voucher Banner ── */}
        <VoucherBanner />

        {/* ── Best Selling Products ── */}
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

        {/* ── Featured Products ── */}
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

        {/* ── Top Rated Products ── */}
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
      </div>

      {/* ── Reviews ── */}
      <section className="w-full mt-12 pb-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <h2
            className="text-[28px] md:text-[32px] text-[#3D2B1A] mb-8"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
          >
            Khách hàng{" "}
            <em className="text-[#C4783A]" style={{ fontStyle: "italic" }}>
              nói gì
            </em>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(reviewsData?.reviews || []).length > 0
              ? (reviewsData?.reviews || [])
                  .slice(0, 3)
                  .map((review: any, i: number) => (
                    <div
                      key={i}
                      className="bg-white border border-[#DDD6C8] rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      <div>
                        <div className="text-[#C4783A] text-sm tracking-[2px] mb-4">
                          {"★".repeat(review.rating || 5)}
                          {"☆".repeat(5 - (review.rating || 5))}
                        </div>
                        <p className="text-[13.5px] text-[#3D2B1A] leading-relaxed italic line-clamp-4">
                          "{review.comment || review.content}"
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#F3EFE8]">
                        <div className="w-10 h-10 rounded-full bg-[#F3EFE8] flex items-center justify-center text-[#8B6F47] text-[12px] font-semibold shrink-0">
                          {(review.user?.name || review.user?.fullName || "K")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-[13px] font-bold text-[#3D2B1A] line-clamp-1">
                            {review.user?.name || review.user?.fullName || "Khách hàng"}
                          </h4>
                          <p className="text-[11px] text-[#8A7966] line-clamp-1">
                            {review.user?.address || "Đã mua hàng tại LUXE"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
              : // Fallback placeholders
                [
                  {
                    text: "Chất lượng sản phẩm thực sự vượt mong đợi. Giao hàng nhanh, đóng gói đẹp. Mình đã mua lần thứ 5 và lần nào cũng hài lòng.",
                    name: "Linh Nguyễn",
                    role: "Khách hàng thân thiết · Hà Nội",
                    initials: "LN",
                  },
                  {
                    text: "Mình mua chiếc đầm lụa cho tiệc cưới. Vải mềm mịn, form dáng chuẩn như hình. Được nhiều người khen lắm. Sẽ ủng hộ shop dài dài!",
                    name: "Minh Tâm",
                    role: "Verified · TP. Hồ Chí Minh",
                    initials: "MT",
                  },
                  {
                    text: "Túi xách đẹp hơn ảnh, da mềm, khóa chắc. Giao hàng đúng hẹn dù order vào dịp sale. Dịch vụ CSKH nhiệt tình, hỗ trợ đổi size nhanh.",
                    name: "Hải Phong",
                    role: "Verified · Đà Nẵng",
                    initials: "HP",
                  },
                ].map((review, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#DDD6C8] rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div>
                      <div className="text-[#C4783A] text-sm tracking-[2px] mb-4">
                        ★★★★★
                      </div>
                      <p className="text-[13.5px] text-[#3D2B1A] leading-relaxed italic line-clamp-4">
                        "{review.text}"
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#F3EFE8]">
                      <div className="w-10 h-10 rounded-full bg-[#F3EFE8] flex items-center justify-center text-[#8B6F47] text-[12px] font-semibold shrink-0">
                        {review.initials}
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#3D2B1A] line-clamp-1">
                          {review.name}
                        </h4>
                        <p className="text-[11px] text-[#8A7966] line-clamp-1">
                          {review.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}
