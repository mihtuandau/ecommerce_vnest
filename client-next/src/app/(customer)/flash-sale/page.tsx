import { FlashSaleView } from "@/features/discounts/components/customer/FlashSaleView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flash Sale - Săn Deal Cháy Máy | LUXE",
  description: "Chương trình Flash Sale hàng tuần với những ưu đãi cực sốc lên đến 50%. Săn ngay kẻo lỡ!",
};

export default function FlashSalePage() {
  return <FlashSaleView />;
}
