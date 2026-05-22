import type { Metadata } from "next";
import { ShopView } from "@/features/products/views/customer/ShopView";

export const metadata: Metadata = {
  title: "Cửa hàng — LUXE",
  description: "Khám phá hàng ngàn sản phẩm công nghệ và gia dụng cao cấp tại LUXE.",
};

export default function ProductListingPage() {
  return <ShopView />;
}
