import type { Metadata } from "next";
import { ShopContainer } from "@/features/shop/components/ShopContainer";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Cửa hàng — Minh Tuấn Shop",
  description: "Khám phá hàng ngàn sản phẩm công nghệ và gia dụng cao cấp tại Minh Tuấn Shop.",
};

import { ShopSkeleton } from "@/features/shop/components/skeletons/ShopSkeleton";

export default function ProductListingPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContainer />
    </Suspense>
  );
}
