"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/axios";
import { Role } from "@/types/enums";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { ROUTES } from "@/constants/routes";

function AuthHandlerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const authSuccess = searchParams.get("auth_success");
    
    if (authSuccess === "true") {
      const handleLoginSuccess = async () => {
        try {
          // 1. Fetch fresh user data
          const { data } = await api.get("/auth/me");
          setUser(data);

          // 2. Show nice notification
          toast.success(`Chào mừng quay trở lại, ${data.name || "bạn"}!`, {
            description: "Đăng nhập thành công với Google",
            duration: 3000,
          });

          // 3. Celebrate!
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#1565C0", "#ffffff", "#64b5f6"]
          });

          // 4. Clean up URL
          const newUrl = window.location.pathname;
          window.history.replaceState({}, "", newUrl);

          // 5. Redirect if staff
          const isStaff = data.role === Role.ADMIN || data.role === Role.KHO || data.role === Role.BAN_HANG;
          if (isStaff) {
            router.push(ROUTES.ADMIN);
          }
        } catch (error) {
          console.error("Auth sync failed:", error);
          toast.error("Không thể đồng bộ thông tin tài khoản");
        }
      };

      handleLoginSuccess();
    }
  }, [searchParams, setUser, router]);

  return null;
}

export function AuthSuccessHandler() {
  return (
    <Suspense fallback={null}>
      <AuthHandlerContent />
    </Suspense>
  );
}
