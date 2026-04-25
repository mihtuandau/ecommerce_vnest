import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết đơn hàng vãng lai — Minh Tuấn Store",
  description: "Xem chi tiết tình trạng và hành trình đơn hàng của bạn.",
};

export default function GuestOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
