import { Suspense } from "react";
import { CheckoutSuccessView } from "@/features/checkout/views/CheckoutSuccessView";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessView />
    </Suspense>
  );
}
