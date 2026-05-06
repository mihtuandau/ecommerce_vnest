import type { Metadata } from "next";
import HomeContainer from "@/features/home/components/HomeContainer";

export const metadata: Metadata = {
  title: "Minh Tuấn Shop — Nền tảng mua sắm trực tuyến hiện đại",
  description: "Khám phá hàng ngàn sản phẩm công nghệ, gia dụng và thời trang chất lượng cao tại Minh Tuấn Shop.",
};

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-slate-50" />}>
      <HomeContainer />
    </Suspense>
  );
}
