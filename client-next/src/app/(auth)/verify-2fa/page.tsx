import { Suspense } from "react";
import { Verify2FAForm } from "@/features/auth/components";
import { Spinner } from "@/components/ui/Spinner";

export default function Verify2FAPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <Verify2FAForm />
    </Suspense>
  );
}
