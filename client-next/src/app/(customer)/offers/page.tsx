import { OffersView } from "@/features/discounts/components/customer/OffersView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ưu Đãi & Khuyến Mãi - Vouchers Độc Quyền | VNest Ecommerce",
  description: "Tổng hợp các mã giảm giá, voucher và chương trình khuyến mãi hấp dẫn nhất tại VNest Ecommerce.",
};

export default function OffersPage() {
  return <OffersView />;
}
