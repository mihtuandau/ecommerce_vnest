"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Facebook } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import Image from "next/image";
import { Role } from "@/types/enums";
import { cn } from "@/utils/cn";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login, isLoggingIn } = useAuth();
  const { success, error } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Vui lòng nhập email";
    if (!password) newErrors.password = "Vui lòng nhập mật khẩu";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await login({ email, password });
      success("Đăng nhập thành công!");

      if (response.user.role === Role.ADMIN) {
        router.push(ROUTES.ADMIN);
      } else {
        router.push(ROUTES.HOME);
      }
    } catch (err: any) {
      error(err?.response?.data?.message || "Email hoặc mật khẩu không chính xác");
      setErrors({ email: " ", password: " " });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/google?_t=${Date.now()}`;
  };

  return (
    <>
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex justify-center mb-4">
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-[1rem] shadow-sm border border-white/20 relative w-fit mx-auto">
            <Image
              src="/logoMT.png"
              alt="Minh Tuan Shop Logo"
              width={128}
              height={32}
              className="h-8 w-auto object-contain"
            />
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-sm">
          Chào mừng!
        </h1>
        <p className="text-white/80 mt-1 font-normal text-[13px] drop-shadow-sm">
          Đăng nhập để tiếp tục mua sắm
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-3.5 sm:space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/80 ml-1.5 drop-shadow-sm">
            Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-white transition-colors" />
            <Input
              required
              type="email"
              placeholder="Nhập địa chỉ email..."
              className={cn(
                "pl-11 h-12 rounded-[1.25rem] border-white/20 bg-black/40 backdrop-blur-md !text-white font-medium placeholder:text-white/60 hover:border-white/40 hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]",
                errors.email ? "border-red-500/50 ring-2 ring-red-500/20 bg-red-500/10" : "focus-visible:ring-primary/50 focus-visible:border-primary"
              )}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && errors.email !== " " && (
              <span className="absolute -bottom-5 left-2 text-[10px] font-bold text-red-400 drop-shadow-sm animate-in fade-in slide-in-from-top-1">
                {errors.email}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between ml-1.5">
            <label className="text-xs font-semibold text-white/80 drop-shadow-sm">
              Mật khẩu
            </label>
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-xs font-medium text-white/80 hover:text-white transition-colors drop-shadow-sm"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-white transition-colors" />
            <Input
              required
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                "pl-11 pr-11 h-12 rounded-[1.25rem] border-white/20 bg-black/40 backdrop-blur-md !text-white font-medium placeholder:text-white/60 hover:border-white/40 hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]",
                errors.password ? "border-red-500/50 ring-2 ring-red-500/20 bg-red-500/10" : "focus-visible:ring-primary/50 focus-visible:border-primary"
              )}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && errors.password !== " " && (
              <span className="absolute -bottom-5 left-2 text-[10px] font-bold text-red-400 drop-shadow-sm animate-in fade-in slide-in-from-top-1">
                {errors.password}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center pt-1 ml-1 group/check">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-white/30 bg-white/5 transition-all checked:bg-primary checked:border-primary hover:border-white/50"
            />
            <svg
              className="absolute left-1 top-1 h-3 w-3 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <label
            htmlFor="remember"
            className="ml-3 text-[13px] font-medium text-slate-200 cursor-pointer select-none hover:text-white transition-colors drop-shadow-sm mt-0.5"
          >
            Ghi nhớ đăng nhập
          </label>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-[1.25rem] text-base font-semibold bg-white text-slate-900 hover:bg-slate-100 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all duration-300 mt-2 flex items-center justify-center gap-2"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <Spinner size="sm" variant="slate" />
              Đang xử lý...
            </>
          ) : (
            "Đăng nhập ngay"
          )}
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-transparent text-white/60 font-semibold text-xs drop-shadow-sm">
              Hoặc
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-[1rem] gap-2 font-semibold text-[14px] border-white/15 bg-white/[0.05] backdrop-blur-md text-white hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-300"
            onClick={handleGoogleLogin}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-[1rem] gap-2 font-semibold text-[14px] border-white/15 bg-white/[0.05] backdrop-blur-md text-white hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-300"
          >
            <Facebook className="h-5 w-5 text-[#1877F2]" />
            Facebook
          </Button>
        </div>

        <p className="text-center text-[13px] text-white/60 pt-4 font-normal drop-shadow-sm">
          Chưa có tài khoản?{" "}
          <Link
            href={ROUTES.REGISTER}
            className="text-white font-bold hover:underline transition-all drop-shadow-sm"
          >
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </>
  );
}
