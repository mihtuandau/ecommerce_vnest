"use client";

import React from "react";
import { HeroBanner } from "@/features/banners";
import {
  FeaturedCategories,
  HomeFlashSaleSection,
  HomeProductShowcase,
  HomeReviewsSection,
  TrustBadges,
  VoucherBanner,
} from "@/features/home/components/customer";
import { HeroBannerSkeleton } from "@/features/home/components/customer/skeletons/HomeSkeletons";
import { useBanners } from "@/features/banners/hooks";
import { useFlashSale } from "@/features/discounts/hooks";
import { useProducts } from "@/features/products/hooks";
import { useLatestReviews } from "@/features/reviews/hooks";

export function HomeView() {
  const { data: bannerData, isLoading: isBannersLoading } = useBanners({
    active: "true",
  });

  const { data: flashSale, isLoading: isFlashSaleLoading } = useFlashSale();

  const { data: featuredData, isLoading: isFeaturedLoading } = useProducts({
    limit: "4",
    sortBy: "newest",
  });

  const { data: bestSellingData, isLoading: isBestSellingLoading } = useProducts({
    limit: "4",
    sortBy: "sold",
  });

  const { data: topRatedData, isLoading: isTopRatedLoading } = useProducts({
    limit: "4",
    sortBy: "rating",
  });

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
      {isBannersLoading ? (
        <HeroBannerSkeleton />
      ) : (
        <HeroBanner banners={Array.isArray(banners) ? banners : []} />
      )}

      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full mt-12 md:mt-16">
        <TrustBadges />
      </section>

      <div className="space-y-20 md:space-y-28 mt-16 md:mt-24">
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <FeaturedCategories />
        </section>

        <HomeFlashSaleSection
          sessions={flashSale}
          isLoading={isFlashSaleLoading}
        />

        <VoucherBanner />

        <HomeProductShowcase
          bestSellingProducts={bestSellingProducts}
          featuredProducts={featuredProducts}
          topRatedProducts={topRatedProducts}
          isBestSellingLoading={isBestSellingLoading}
          isFeaturedLoading={isFeaturedLoading}
          isTopRatedLoading={isTopRatedLoading}
        />
      </div>

      <HomeReviewsSection reviews={reviewsData?.reviews || []} />
    </div>
  );
}
