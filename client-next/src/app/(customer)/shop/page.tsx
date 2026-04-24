import type { Metadata } from "next";
import { ShopContainer } from "@/features/shop/components/ShopContainer";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Cửa hàng — Vnest Store",
  description: "Khám phá hàng ngàn sản phẩm công nghệ và gia dụng cao cấp tại Vnest Store.",
};

export default function ProductListingPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Đang chuẩn bị bộ sưu tập...</p>
        </div>
      }
    >
      <ShopContainer />
    </Suspense>
  );
}
