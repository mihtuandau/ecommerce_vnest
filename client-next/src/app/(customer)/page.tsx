import type { Metadata } from "next";
import { HomeView } from "@/features/home/views/customer/HomeView";

export const metadata: Metadata = {
  title: "LUXE — Nền tảng mua sắm trực tuyến hiện đại",
  description:
    "Khám phá hàng ngàn sản phẩm công nghệ, gia dụng và thời trang chất lượng cao tại LUXE.",
};

import { Suspense } from "react";
import { HeroBannerSkeleton } from "@/features/home/components/customer/skeletons/HomeSkeletons";

export default function HomePage() {
  return (
    <Suspense fallback={<HeroBannerSkeleton />}>
      <HomeView />
    </Suspense>
  );
}
