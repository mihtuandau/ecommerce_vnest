import type { Metadata } from "next";
import HomeContainer from "@/features/home/components/HomeContainer";

export const metadata: Metadata = {
  title: "Minh Tuấn Shop — Nền tảng mua sắm trực tuyến hiện đại",
  description: "Khám phá hàng ngàn sản phẩm công nghệ, gia dụng và thời trang chất lượng cao tại Minh Tuấn Shop.",
};

export default function HomePage() {
  return <HomeContainer />;
}
