import { Suspense } from "react";
import { CheckoutSuccessView } from "@/features/checkout/views";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessView />
    </Suspense>
  );
}
