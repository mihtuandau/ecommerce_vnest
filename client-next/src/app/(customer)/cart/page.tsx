import type { Metadata } from "next";
import { CartView } from "@/features/cart/components/CartView";

export const metadata: Metadata = {
  title: "Giỏ hàng — LUXE",
  description: "Kiểm tra các sản phẩm trong giỏ hàng của bạn và tiến hành thanh toán.",
};

export default function CartPage() {
  return <CartView />;
}
