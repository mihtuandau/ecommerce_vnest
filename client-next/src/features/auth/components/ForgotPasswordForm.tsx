"use client";

import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Mail, ArrowLeft } from "lucide-react";
import { authApi } from "@/features/auth/api";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      success("Mã OTP đã được gửi! Vui lòng kiểm tra email.");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      error(err?.response?.data?.message || "Email không tồn tại trong hệ thống");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex justify-center mb-4">
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-[1rem] shadow-sm border border-white/20">
            <Image
              src="/logoMT.png"
              alt="Minh Tuan Shop Logo"
              width={128}
              height={32}
              className="h-8 w-auto object-contain"
            />
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
          Quên mật khẩu?
        </h1>
        <p className="text-slate-200 mt-1 font-medium text-[13px] drop-shadow-sm">
          Nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="forgot-email" className="text-[11px] font-bold text-slate-200 ml-1.5 uppercase tracking-widest drop-shadow-sm">
            Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-white transition-colors" />
            <Input
              id="forgot-email"
              required
              type="email"
              placeholder="name@example.com"
              className="pl-11 h-12 rounded-[1.25rem] border-white/10 bg-white/10 backdrop-blur-md text-white font-medium placeholder:text-slate-300 hover:border-white/30 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:border-white/50 focus-visible:bg-white/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-[1.25rem] text-base font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all duration-300 mt-4"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Gửi yêu cầu"}
        </Button>

        <div className="mt-4 text-center">
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-[13px] font-bold text-slate-300 hover:text-white transition-colors drop-shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </>
  );
}
