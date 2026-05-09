import type { Metadata } from "next";
import { CheckoutContainer } from "@/features/checkout/components/CheckoutContainer";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "Thanh toán — Minh Tuấn Store",
  description: "Hoàn tất đơn hàng của bạn với các phương thức thanh toán an toàn.",
};

export default function CheckoutPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <Spinner size="lg" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Đang chuẩn bị thanh toán...</p>
        </div>
      }
    >
      <CheckoutContainer />
    </Suspense>
  );
}
