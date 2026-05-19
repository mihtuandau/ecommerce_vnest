import type { Metadata } from "next";
import { ShopView } from "@/features/products/components/customer/shop/ShopView";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Cửa hàng — LUXE",
  description: "Khám phá hàng ngàn sản phẩm công nghệ và gia dụng cao cấp tại LUXE.",
};

import { ShopSkeleton } from "@/features/products/components/customer/shop/skeletons/ShopSkeleton";

export default function ProductListingPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopView />
    </Suspense>
  );
}
