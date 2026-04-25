import type { Metadata } from "next";
import { ShopContainer } from "@/features/shop/components/ShopContainer";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Cửa hàng — Vnest Store",
  description: "Khám phá hàng ngàn sản phẩm công nghệ và gia dụng cao cấp tại Vnest Store.",
};

import { ShopSkeleton } from "@/features/shop/components/skeletons/ShopSkeleton";

export default function ProductListingPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContainer />
    </Suspense>
  );
}
