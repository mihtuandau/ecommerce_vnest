import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết sản phẩm — LUXE",
  description: "Khám phá chi tiết sản phẩm, thông số kỹ thuật và ưu đãi hấp dẫn.",
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
