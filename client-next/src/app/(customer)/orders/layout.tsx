import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn hàng của tôi — Minh Tuấn Store",
  description: "Quản lý và theo dõi lịch sử đơn hàng của bạn tại Minh Tuấn Store.",
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
