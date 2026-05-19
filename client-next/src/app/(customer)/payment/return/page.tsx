import { PaymentReturnView } from "@/features/checkout/components/PaymentReturnView";
import { Metadata } from "next";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "Kết quả thanh toán — LUXE",
  description: "Kiểm tra kết quả giao dịch thanh toán của bạn.",
};

export default function PaymentReturnPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
          <Spinner size="lg" />
        </div>
      }
    >
      <PaymentReturnView />
    </Suspense>
  );
}
