import type { Metadata } from "next";
import { FlashSaleView } from "@/features/discounts/views/customer/FlashSaleView";

export const metadata: Metadata = {
  title: "Flash Sale - Săn Deal Cháy Máy | LUXE",
  description:
    "Chương trình Flash Sale hằng tuần với những ưu đãi cực sốc lên đến 50%. Săn ngay kẻo lỡ!",
};

export default function FlashSalePage() {
  return <FlashSaleView />;
}
