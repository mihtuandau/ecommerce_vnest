import { Metadata } from "next";
import { WishlistView } from "@/features/wishlist/views/customer/WishlistView";

export const metadata: Metadata = {
  title: "Danh sách yêu thích | LUXE",
  description: "Sản phẩm bạn đã lưu để mua sắm sau.",
};

export default function WishlistPage() {
  return <WishlistView />;
}
