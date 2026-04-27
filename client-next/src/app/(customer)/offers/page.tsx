import { OffersView } from "@/features/discounts/components/customer/OffersView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ưu Đãi & Khuyến Mãi - Vouchers Độc Quyền | Minh Tuấn Shop",
  description: "Tổng hợp các mã giảm giá, voucher và chương trình khuyến mãi hấp dẫn nhất tại Minh Tuấn Shop.",
};

export default function OffersPage() {
  return <OffersView />;
}
