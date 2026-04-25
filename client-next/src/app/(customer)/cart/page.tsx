import type { Metadata } from "next";
import { CartContainer } from "@/features/cart/components/CartContainer";

export const metadata: Metadata = {
  title: "Giỏ hàng — Vnest Store",
  description: "Kiểm tra các sản phẩm trong giỏ hàng của bạn và tiến hành thanh toán.",
};

export default function CartPage() {
  return <CartContainer />;
}
