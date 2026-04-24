"use client";

import { useState, Suspense } from "react";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { authApi } from "@/features/auth/api";

function ResetPasswordForm() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { success, error } = useToast();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      error("Vui lòng nhập mã OTP.");
      return;
    }
    if (!email) {
      error("Thiếu thông tin email. Vui lòng quay lại trang quên mật khẩu.");
      return;
    }
    if (password !== confirmPassword) {
      error("Mật khẩu không khớp");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(token, email, password);
      success("Đổi mật khẩu thành công!");
      setSuccessState(true);
    } catch (err: any) {
      error(err?.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
          <Link href="/" className="inline-flex justify-center mb-4">
            <div className="bg-white/80 backdrop-blur-md p-3 rounded-[1rem] shadow-sm border border-white/20">
              <img src="/logo.png" alt="Vnest Logo" className="h-8 w-auto object-contain" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">Đặt lại mật khẩu</h1>
          <p className="text-slate-200 mt-1 font-medium text-[13px] drop-shadow-sm">
            {successState 
              ? "Mật khẩu của bạn đã được cập nhật thành công."
              : "Vui lòng nhập mã OTP và mật khẩu mới."}
          </p>
        </div>

        {!successState ? (
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-200 ml-1.5 uppercase tracking-widest drop-shadow-sm">Mã OTP (6 số)</label>
              <div className="relative group">
                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-white transition-colors" />
                <Input
                  required
                  type="text"
                  placeholder="Nhập mã OTP..."
                  className="pl-11 h-12 rounded-[1.25rem] border-white/10 bg-white/10 backdrop-blur-md text-white font-medium placeholder:text-slate-300 hover:border-white/30 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:border-white/50 focus-visible:bg-white/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-center tracking-widest text-lg"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  maxLength={6}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-200 ml-1.5 uppercase tracking-widest drop-shadow-sm">Mật khẩu mới</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-white transition-colors" />
                <Input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-12 rounded-[1.25rem] border-white/10 bg-white/10 backdrop-blur-md text-white font-medium placeholder:text-slate-300 hover:border-white/30 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:border-white/50 focus-visible:bg-white/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-200 ml-1.5 uppercase tracking-widest drop-shadow-sm">Xác nhận mật khẩu</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-white transition-colors" />
                <Input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-12 rounded-[1.25rem] border-white/10 bg-white/10 backdrop-blur-md text-white font-medium placeholder:text-slate-300 hover:border-white/30 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:border-white/50 focus-visible:bg-white/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-[1.25rem] text-base font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all duration-300 mt-4"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center animate-in zoom-in-95 duration-500">
            <div className="h-16 w-16 rounded-[1.25rem] bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center mb-4 shadow-lg">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <Button
              asChild
              className="w-full h-12 rounded-[1.25rem] text-base font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all duration-300 mt-2"
            >
              <Link href={ROUTES.LOGIN}>Đăng nhập ngay</Link>
            </Button>
          </div>
        )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><p className="text-white">Đang tải...</p></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
