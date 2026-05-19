import type { Metadata } from "next";
import { ShopContainer } from "@/features/products/components/customer/shop/ShopContainer";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Cửa hàng — LUXE",
  description: "Khám phá hàng ngàn sản phẩm công nghệ và gia dụng cao cấp tại LUXE.",
};

import { ShopSkeleton } from "@/features/products/components/customer/shop/skeletons/ShopSkeleton";

export default function ProductListingPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContainer />
    </Suspense>
  );
}
