import type { Metadata } from "next";
import HomeContainer from "@/features/home/components/HomeContainer";

export const metadata: Metadata = {
  title: "LUXE — Nền tảng mua sắm trực tuyến hiện đại",
  description: "Khám phá hàng ngàn sản phẩm công nghệ, gia dụng và thời trang chất lượng cao tại LUXE.",
};

import { Suspense } from "react";
import { HeroBannerSkeleton } from "@/features/home/components/skeletons/HomeSkeletons";

export default function HomePage() {
  return (
    <Suspense fallback={<HeroBannerSkeleton />}>
      <HomeContainer />
    </Suspense>
  );
}
