import { Suspense } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Verify2FAView } from "@/features/auth/views/Verify2FAView";

export default function Verify2FAPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <Verify2FAView />
    </Suspense>
  );
}
