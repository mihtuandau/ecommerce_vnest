import type { Metadata } from "next";
import { OffersView } from "@/features/discounts/views/customer/OffersView";

export const metadata: Metadata = {
  title: "Ưu Đãi & Khuyến Mãi - Vouchers Độc Quyền | LUXE",
  description:
    "Tổng hợp các mã giảm giá, voucher và chương trình khuyến mãi hấp dẫn nhất tại LUXE.",
};

export default function OffersPage() {
  return <OffersView />;
}
