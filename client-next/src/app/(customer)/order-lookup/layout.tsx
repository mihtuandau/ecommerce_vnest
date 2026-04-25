import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng — Minh Tuấn Store",
  description: "Theo dõi tình trạng đơn hàng của bạn chỉ với mã đơn và số điện thoại.",
};

export default function OrderLookupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
