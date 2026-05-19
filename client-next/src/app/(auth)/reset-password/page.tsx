import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <p className="text-white">Đang tải...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
