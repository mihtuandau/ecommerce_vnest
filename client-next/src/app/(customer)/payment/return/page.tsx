import { PaymentReturnView } from "@/features/checkout/components/PaymentReturnView";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Kết quả thanh toán — Minh Tuấn Store",
  description: "Kiểm tra kết quả giao dịch thanh toán của bạn.",
};

export default function PaymentReturnPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
        </div>
      }
    >
      <PaymentReturnView />
    </Suspense>
  );
}
