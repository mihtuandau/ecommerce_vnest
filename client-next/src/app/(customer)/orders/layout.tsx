import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn hàng của tôi — LUXE",
  description: "Quản lý và theo dõi lịch sử đơn hàng của bạn tại LUXE.",
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
