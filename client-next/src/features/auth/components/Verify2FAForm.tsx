"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Role } from "@/types/enums";
import { ROUTES } from "@/constants/routes";

export function Verify2FAForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otpCode, setOtpCode] = useState("");
  const { verify2FALogin, isLoggingIn } = useAuth();
  const { success, error } = useToast();
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) return error("Vui lòng nhập đủ 6 chữ số");

    try {
      const response = await verify2FALogin({ email, code: otpCode });
      success("Xác thực thành công!");

      const isStaff =
        response.user?.role === Role.ADMIN ||
        response.user?.role === Role.KHO ||
        response.user?.role === Role.BAN_HANG;
      if (isStaff) {
        router.push(ROUTES.ADMIN);
      } else {
        router.push(ROUTES.HOME);
      }
    } catch (err: any) {
      error(err?.response?.data?.message || "Mã xác thực không chính xác");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F4] px-4 font-sans">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[32px] p-8 sm:p-12 shadow-2xl shadow-brand-espresso/5 border border-brand-sand/50 text-center">
          <div className="w-20 h-20 bg-brand-ivory rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-sand/30">
            <ShieldCheck className="text-brand-bronze" size={40} />
          </div>

          <h1 className="text-2xl font-bold text-brand-espresso mb-2">
            Xác thực bảo mật
          </h1>
          <p className="text-[14px] text-brand-taupe mb-8">
            Vui lòng nhập mã xác thực 6 chữ số đã được gửi đến email <br />
            <span className="font-bold text-brand-espresso">{email}</span>
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="verify-2fa-otp" className="sr-only">Mã xác thực OTP</label>
              <Input
                id="verify-2fa-otp"
                required
                type="text"
                placeholder="000000"
                className="h-16 text-center text-3xl tracking-[12px] font-bold rounded-2xl border-brand-sand bg-brand-ivory/10 focus:ring-brand-bronze/20 focus:border-brand-bronze"
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
            </div>

            <Button
              type="submit"
              disabled={isLoggingIn || otpCode.length < 6}
              className="w-full h-14 rounded-full bg-brand-espresso text-white font-bold text-base shadow-lg shadow-brand-espresso/10 hover:scale-[1.02] transition-all"
            >
              {isLoggingIn ? (
                <Spinner size="sm" variant="white" />
              ) : (
                "Xác nhận đăng nhập"
              )}
            </Button>

            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="flex items-center justify-center gap-2 text-[13px] font-bold text-brand-taupe hover:text-brand-espresso mx-auto transition-colors"
            >
              <ArrowLeft size={16} /> Quay lại đăng nhập
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Image
            src="/logoMT.png"
            alt="Logo"
            width={120}
            height={30}
            className="mx-auto opacity-40"
          />
        </div>
      </div>
    </div>
  );
}
