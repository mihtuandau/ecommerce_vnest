"use client";

import React, { useState } from "react";
import {
  Lock,
  Info,
  ShieldAlert,
  Mail,
  Eye,
  Smartphone,
  ChevronRight,
  Monitor,
  Laptop,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import { useSessions, useRevokeSession } from "@/features/auth/hooks/useSessions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Spinner } from "@/components/ui/Spinner";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { Switch } from "@/components/ui/Switch";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function SecurityTab() {
  const { success, error } = useToast();
  const { user, setUser } = useAuthStore();
  const { data: sessions, isLoading: isLoadingSessions } = useSessions();
  const revokeSession = useRevokeSession();

  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isLoading2FA, setIsLoading2FA] = useState(false);

  const handleRevoke = (id: number) => {
    revokeSession.mutate(id, {
      onSuccess: () => success("Đã đăng xuất thiết bị thành công"),
      onError: () => error("Không thể đăng xuất thiết bị này"),
    });
  };

  const handleToggle2FA = async () => {
    try {
      setIsLoading2FA(true);
      const { data } = await axios.post(
        `${API_URL}/auth/2fa/toggle`,
        {},
        { withCredentials: true }
      );

      if (data.requiresVerification) {
        setIs2FAModalOpen(true);
        success(data.message);
      } else {
        // Disabled 2FA
        if (user) setUser({ ...user, twoFactorEnabled: false });
        success(data.message);
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Thao tác thất bại");
    } finally {
      setIsLoading2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!otpCode || otpCode.length < 6) return error("Vui lòng nhập đủ 6 chữ số");

    try {
      setIsLoading2FA(true);
      const { data } = await axios.post(
        `${API_URL}/auth/2fa/verify-activate`,
        { code: otpCode },
        { withCredentials: true }
      );
      if (user) setUser({ ...user, twoFactorEnabled: true });
      success(data.message);
      setIs2FAModalOpen(false);
      setOtpCode("");
    } catch (err: any) {
      error(err.response?.data?.message || "Mã xác thực không chính xác");
    } finally {
      setIsLoading2FA(false);
    }
  };

  const getDeviceIcon = (ua: string | null) => {
    const agent = ua || "";
    if (agent.includes("Mobi") || agent.includes("Android") || agent.includes("iPhone"))
      return <Smartphone size={18} />;
    if (agent.includes("Macintosh") || agent.includes("Windows"))
      return <Monitor size={18} />;
    return <Laptop size={18} />;
  };

  const getDeviceName = (ua: string | null) => {
    if (!ua) return "Thiết bị không xác định";
    if (ua.includes("Edg/")) return "Microsoft Edge";
    if (ua.includes("Chrome/")) return "Google Chrome";
    if (ua.includes("Firefox/")) return "Mozilla Firefox";
    if (ua.includes("Safari/") && !ua.includes("Chrome")) return "Apple Safari";
    if (ua.includes("iPhone")) return "iPhone";
    if (ua.includes("Android")) return "Android Device";
    return ua.split(" ")[0] || "Thiết bị không xác định";
  };

  const getOSName = (ua: string | null) => {
    if (!ua) return "";
    if (ua.includes("Windows")) return "on Windows";
    if (ua.includes("Macintosh")) return "on macOS";
    if (ua.includes("Linux")) return "on Linux";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    return "";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white border border-brand-sand rounded-[24px] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-brand-sand/50">
          <h2 className="text-base font-semibold text-brand-espresso flex items-center gap-2.5">
            <Lock size={18} className="text-brand-bronze" /> Đổi mật khẩu
          </h2>
        </div>
        <div className="p-6 lg:p-8 space-y-8 max-w-xl">
          <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 flex gap-3">
            <div className="text-blue-500 shrink-0 mt-0.5">
              <Info size={18} />
            </div>
            <p className="text-[12.5px] text-blue-800/80 leading-relaxed">
              Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt để
              đảm bảo an toàn cho tài khoản.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2.5">
              <label htmlFor="current-password" className="text-sm font-medium text-brand-espresso ml-1">
                Mật khẩu hiện tại <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 text-brand-taupe/30 group-focus-within:text-brand-bronze transition-colors z-10">
                  <Lock size={16} />
                </div>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 pl-12 pr-5 rounded-xl border border-brand-sand/60 focus:ring-0 focus-visible:ring-0 focus:border-brand-bronze/60 transition-all bg-white focus:shadow-[0_0_0_1px_rgba(196,120,58,0.1)]"
                />
              </div>
            </div>
            <div className="space-y-2.5">
              <label htmlFor="new-password" className="text-sm font-medium text-brand-espresso ml-1">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 text-brand-taupe/30 group-focus-within:text-brand-bronze transition-colors z-10">
                  <ShieldAlert size={16} />
                </div>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 pl-12 pr-5 rounded-xl border border-brand-sand/60 focus:ring-0 focus-visible:ring-0 focus:border-brand-bronze/60 transition-all bg-white focus:shadow-[0_0_0_1px_rgba(196,120,58,0.1)]"
                />
              </div>
            </div>
            <div className="space-y-2.5">
              <label htmlFor="confirm-password" className="text-sm font-medium text-brand-espresso ml-1">
                Xác nhận mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 text-brand-taupe/30 group-focus-within:text-brand-bronze transition-colors z-10">
                  <CheckCircle2 size={16} />
                </div>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 pl-12 pr-5 rounded-xl border border-brand-sand/60 focus:ring-0 focus-visible:ring-0 focus:border-brand-bronze/60 transition-all bg-white focus:shadow-[0_0_0_1px_rgba(196,120,58,0.1)]"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-5 bg-brand-ivory/20 border-t border-brand-sand/50 flex justify-end gap-3">
          <Button
            variant="ghost"
            className="rounded-full h-11 px-8 text-[13px] font-bold text-brand-taupe hover:bg-brand-sand/20"
          >
            Huỷ thay đổi
          </Button>
          <Button className="rounded-full h-11 px-10 text-[13px] font-bold bg-brand-espresso text-white hover:bg-brand-espresso/90 shadow-xl shadow-brand-espresso/10 transition-all">
            Lưu mật khẩu mới
          </Button>
        </div>
      </div>

      
      <div className="bg-white border border-brand-sand rounded-[24px] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-brand-sand/50">
          <h2 className="text-base font-semibold text-brand-espresso flex items-center gap-2.5">
            <ShieldAlert size={20} className="text-brand-bronze" /> Bảo mật & Đăng nhập
          </h2>
        </div>
        <div className="p-6 lg:p-8 space-y-5">
          
          <div className="flex items-center justify-between p-5 border border-brand-sand/60 rounded-[24px] hover:border-brand-bronze/40 transition-all group bg-brand-cream/10">
            <div className="flex items-center gap-5">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300",
                  user?.twoFactorEnabled
                    ? "bg-emerald-500 text-white shadow-emerald-200"
                    : "bg-brand-ivory text-brand-taupe"
                )}
              >
                <Smartphone size={22} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[15px] font-semibold text-brand-espresso">
                  Xác thực 2 lớp (2FA)
                </p>
                <p className="text-[13px] text-brand-taupe font-medium">
                  Bảo mật tài khoản qua mã xác nhận Email
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isLoading2FA && <Spinner size="sm" />}
              <Switch
                checked={!!user?.twoFactorEnabled}
                onCheckedChange={handleToggle2FA}
                disabled={isLoading2FA}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </div>

          
          <div
            onClick={() => setIsSessionModalOpen(true)}
            className="flex items-center justify-between p-5 border border-brand-sand/60 rounded-[20px] hover:bg-brand-ivory/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-brand-ivory flex items-center justify-center text-brand-taupe shadow-sm group-hover:scale-105 transition-transform">
                <Eye size={20} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[14.5px] font-semibold text-brand-espresso">
                  Quản lý phiên đăng nhập
                </p>
                <p className="text-[13px] text-brand-taupe">
                  Xem và đăng xuất khỏi các thiết bị khác
                </p>
              </div>
            </div>
            <button className="text-sm font-semibold text-brand-bronze hover:underline flex items-center gap-1">
              Chi tiết <ChevronRight size={14} />
            </button>
          </div>

          
          <div className="flex items-center justify-between p-5 border border-red-100 rounded-[20px] bg-red-50/20 hover:bg-red-50/40 transition-all group">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm group-hover:scale-105 transition-transform">
                <Smartphone size={20} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[14.5px] font-semibold text-brand-espresso">
                  Xóa tài khoản
                </p>
                <p className="text-[13px] text-red-500/80">
                  Hành động này không thể hoàn tác
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-red-200 text-red-500 hover:bg-red-500 hover:text-white text-[12px] font-bold rounded-full px-6 h-10 transition-all"
            >
              Yêu cầu xóa
            </Button>
          </div>
        </div>
      </div>

      
      <Dialog open={is2FAModalOpen} onOpenChange={setIs2FAModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="px-8 py-8 bg-brand-ivory/30 text-center">
            <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-sand">
              <Mail className="text-brand-bronze" size={30} />
            </div>
            <DialogTitle className="text-[20px] font-bold text-brand-espresso">
              Kích hoạt bảo mật 2 lớp
            </DialogTitle>
            <DialogDescription className="text-[13px] text-brand-taupe mt-2">
              Chúng tôi vừa gửi mã xác thực gồm 6 chữ số đến email của bạn. Vui lòng
              nhập mã để hoàn tất.
            </DialogDescription>
          </DialogHeader>

          <div className="p-10 space-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-brand-espresso ml-1">
                Mã xác thực
              </label>
              <Input
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="h-14 text-center text-2xl tracking-[12px] font-bold rounded-2xl border-brand-sand bg-brand-ivory/10 focus:ring-brand-bronze/20 focus:border-brand-bronze transition-all"
              />
            </div>
            <Button
              onClick={handleVerify2FA}
              disabled={isLoading2FA || otpCode.length < 6}
              className="w-full h-12 rounded-full bg-brand-espresso text-white font-bold text-[14px] shadow-lg shadow-brand-espresso/10"
            >
              {isLoading2FA ? (
                <Spinner size="sm" variant="white" />
              ) : (
                "Xác nhận kích hoạt"
              )}
            </Button>
          </div>

          <div className="px-8 py-5 bg-brand-ivory/10 text-center border-t border-brand-sand/50">
            <button
              onClick={handleToggle2FA}
              disabled={isLoading2FA}
              className="text-[12px] font-bold text-brand-bronze hover:underline"
            >
              Gửi lại mã xác thực
            </button>
          </div>
        </DialogContent>
      </Dialog>

      
      <Dialog open={isSessionModalOpen} onOpenChange={setIsSessionModalOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="px-8 py-6 bg-brand-ivory/30 border-b border-brand-sand/50">
            <DialogTitle className="text-[18px] font-bold text-brand-espresso flex items-center gap-2.5">
              <Eye className="text-brand-bronze" size={20} /> Thiết bị đang đăng nhập
            </DialogTitle>
            <DialogDescription className="text-[12.5px] text-brand-taupe">
              Danh sách các thiết bị hiện đang duy trì phiên đăng nhập của bạn.
            </DialogDescription>
          </DialogHeader>

          <div className="p-2 max-h-[450px] overflow-y-auto custom-scrollbar">
            {isLoadingSessions ? (
              <div className="py-12 flex justify-center">
                <Spinner />
              </div>
            ) : (sessions || []).length === 0 ? (
              <div className="py-12 text-center text-brand-taupe text-[13px]">
                Không tìm thấy phiên đăng nhập nào.
              </div>
            ) : (
              <div className="divide-y divide-brand-sand/30">
                {(sessions || []).map((session: any) => (
                  <div
                    key={session.id}
                    className="p-6 flex items-center justify-between hover:bg-brand-cream/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-ivory flex items-center justify-center text-brand-taupe group-hover:bg-white transition-colors">
                        {getDeviceIcon(session.userAgent)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-[14px] font-bold text-brand-espresso">
                          {getDeviceName(session.userAgent)}{" "}
                          {getOSName(session.userAgent)}
                        </p>
                        <div className="flex items-center gap-2 text-[11.5px] text-brand-taupe">
                          <span className="font-medium">
                            {session.ipAddress || "Không rõ IP"}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(session.createdAt).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => handleRevoke(session.id)}
                      disabled={revokeSession.isPending}
                      className="text-[11px] font-bold text-red-500 hover:bg-red-50 h-9 px-4 rounded-full"
                    >
                      {revokeSession.isPending ? <Spinner size="sm" /> : "Đăng xuất"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-8 py-5 bg-brand-ivory/10 border-t border-brand-sand/50 flex justify-end">
            <Button
              onClick={() => setIsSessionModalOpen(false)}
              className="rounded-full px-8 bg-brand-espresso text-white"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
