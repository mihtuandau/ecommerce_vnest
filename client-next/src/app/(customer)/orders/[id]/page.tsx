import { OrderDetailView } from "@/features/orders/components/customer/OrderDetailView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết đơn hàng — LUXE",
  description: "Xem chi tiết thông tin đơn hàng của bạn.",
};

export default function OrderDetailPage() {
  return <OrderDetailView />;
}
