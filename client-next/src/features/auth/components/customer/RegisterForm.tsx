"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, Phone, Facebook, Eye, EyeOff } from "lucide-react";

export function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, isRegistering } = useAuth();
  const { success, error } = useToast();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      error("Mật khẩu xác nhận không khớp");
      return;
    }
    
    try {
      await register({
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
      });
      success("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push(ROUTES.LOGIN);
    } catch (err: any) {
      error(err?.response?.data?.message || "Email đã tồn tại hoặc dữ liệu không hợp lệ");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google?_t=${Date.now()}`;
  };

  return (
    <>
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex justify-center mb-4">
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-[1rem] shadow-sm border border-white/20">
            <img src="/logoMT.png" alt="Minh Tuan Shop Logo" className="h-8 w-auto object-contain" />
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">Tạo tài khoản</h1>
        <p className="text-slate-200 mt-1 font-medium text-[13px] drop-shadow-sm">Đăng ký để bắt đầu mua sắm</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-3.5 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 ml-1.5 drop-shadow-sm">Họ và tên</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-white transition-colors" />
              <Input
                required
                placeholder="Nhập tên..."
                className="pl-11 h-12 rounded-[1.25rem] border-white/10 bg-white/10 backdrop-blur-md text-white font-medium placeholder:text-slate-300 hover:border-white/30 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:border-white/50 focus-visible:bg-white/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 ml-1.5 drop-shadow-sm">Số điện thoại</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-white transition-colors" />
              <Input
                required
                type="tel"
                placeholder="0912..."
                className="pl-11 h-12 rounded-[1.25rem] border-white/10 bg-white/10 backdrop-blur-md text-white font-medium placeholder:text-slate-300 hover:border-white/30 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:border-white/50 focus-visible:bg-white/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-200 ml-1.5 drop-shadow-sm">Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-white transition-colors" />
            <Input
              required
              type="email"
              placeholder="name@example.com"
              className="pl-11 h-12 rounded-[1.25rem] border-white/10 bg-white/10 backdrop-blur-md text-white font-medium placeholder:text-slate-300 hover:border-white/30 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:border-white/50 focus-visible:bg-white/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 ml-1.5 drop-shadow-sm">Mật khẩu</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-white transition-colors" />
              <Input
                required
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-11 pr-11 h-12 rounded-[1.25rem] border-white/10 bg-white/10 backdrop-blur-md text-white font-medium placeholder:text-slate-300 hover:border-white/30 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:border-white/50 focus-visible:bg-white/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 ml-1.5 drop-shadow-sm">Xác nhận</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-white transition-colors" />
              <Input
                required
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-11 pr-11 h-12 rounded-[1.25rem] border-white/10 bg-white/10 backdrop-blur-md text-white font-medium placeholder:text-slate-300 hover:border-white/30 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:border-white/50 focus-visible:bg-white/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                value={form.confirmPassword}
                onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors">
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3 pt-2 ml-1">
          <input type="checkbox" id="terms" required className="mt-0.5 w-5 h-5 rounded-[6px] border-white/20 bg-white/10 text-slate-900 focus:ring-white/50 cursor-pointer shadow-sm transition-all" />
          <label htmlFor="terms" className="text-[13px] text-slate-200 font-medium leading-tight select-none cursor-pointer drop-shadow-sm mt-0.5">
            Tôi đồng ý với <Link href="/terms" className="text-white font-bold hover:underline">Điều khoản</Link> & <Link href="/privacy" className="text-white font-bold hover:underline">Bảo mật</Link>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-[1.25rem] text-base font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all duration-300 mt-2"
          disabled={isRegistering}
        >
          {isRegistering ? "Đang xử lý..." : "Đăng ký ngay"}
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-transparent text-slate-200 font-semibold text-xs drop-shadow-sm">
              Hoặc
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <Button 
            type="button" 
            variant="outline" 
            className="h-12 rounded-[1rem] gap-2 font-bold text-[14px] border-white/15 bg-white/[0.05] backdrop-blur-md text-white hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-300"
            onClick={handleGoogleLogin}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="h-12 rounded-[1rem] gap-2 font-bold text-[14px] border-white/15 bg-white/[0.05] backdrop-blur-md text-white hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-300"
          >
            <Facebook className="h-5 w-5 text-[#1877F2]" />
            Facebook
          </Button>
        </div>

        <p className="text-center text-[13px] text-slate-300 pt-3 font-medium drop-shadow-sm">
          Đã có tài khoản?{" "}
          <Link href={ROUTES.LOGIN} className="text-white font-extrabold hover:underline transition-all drop-shadow-sm">
            Đăng nhập
          </Link>
        </p>
      </form>
    </>
  );
}
