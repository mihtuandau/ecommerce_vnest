"use client";

import Link from "next/link";
import {
  Search,
  Bell,
  Command,
  User as UserIcon,
  Shield,
  Globe,
  ExternalLink,
  Settings,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Image from "next/image";
import { Role } from "@/types/enums";
import { ROLE_CONFIG } from "@/features/permissions/constants";
import { useNotifications, useMarkNotificationRead } from "@/features/notifications/hooks";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import { getImageUrl } from "@/utils/image";

export function AdminTopBar() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const router = useRouter();

  // Fetch real-time unread notifications count and top 5 recent notifications
  const { data: notificationsData } = useNotifications({ limit: 5 });
  const markReadMutation = useMarkNotificationRead();

  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleNotifClick = (notif: any) => {
    if (!notif.isRead) {
      markReadMutation.mutate(notif.id);
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <header className="h-16 border-b border-slate-100/90 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 transition-all font-sans select-none">
      {/* Left side: Search & Admin Badge */}
      <div className="flex items-center gap-3.5 w-1/3">
        <div className="relative w-full max-w-[280px] group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
          <Input
            placeholder="Tìm kiếm nhanh... (Ctrl + K)"
            className="pl-9 pr-10 h-9 bg-slate-50/80 border border-slate-100 hover:bg-slate-50 focus:bg-white focus:border-slate-200 transition-all rounded-xl text-[12px] focus:ring-0 focus-visible:ring-0 focus-visible:outline-none placeholder-slate-400 text-slate-700"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[9px] font-medium text-slate-400 shadow-3xs">
            <Command className="h-2.5 w-2.5 opacity-80" />
            <span>K</span>
          </div>
        </div>

        {/* Live Admin Mode Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/60 text-[9px] font-bold text-slate-500 tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          SYSTEM ACTIVE
        </div>
      </div>

      {/* Right side: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2">
        {/* Visit Shop Button */}
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex items-center gap-1.5 rounded-xl h-9 px-3 border border-slate-200 bg-white text-[12px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-850 hover:border-slate-300 transition-all shadow-3xs"
          asChild
        >
          <Link href="/" target="_blank">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            Xem cửa hàng
            <ExternalLink className="h-3 w-3 ml-0.5 opacity-40 shrink-0" />
          </Link>
        </Button>

        <div className="h-4 w-[1px] bg-slate-200 mx-1.5 hidden md:block" />

        {/* Live Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl hover:bg-slate-50 size-9 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 rounded-full bg-slate-900 border-2 border-white text-[7px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 mt-2.5 rounded-2xl p-2 shadow-2xl border border-slate-100 bg-white animate-in fade-in zoom-in-95 duration-200 space-y-1"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-50">
              <span className="font-bold text-[10px] tracking-wider text-slate-400 uppercase">Thông báo mới</span>
              {unreadCount > 0 && (
                <span className="text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} chưa đọc
                </span>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-medium italic">
                  Không có thông báo mới nào
                </div>
              ) : (
                notifications.map((n: any) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotifClick(n)}
                    className={cn(
                      "p-2.5 cursor-pointer hover:bg-slate-50 transition-all rounded-xl flex gap-2.5 items-start",
                      !n.isRead && "bg-slate-50/40"
                    )}
                  >
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                      !n.isRead ? "bg-slate-900 animate-pulse" : "bg-transparent"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[11.5px] truncate", !n.isRead ? "text-slate-800 font-bold" : "text-slate-500 font-medium")}>
                        {n.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
                        {n.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <DropdownMenuSeparator className="bg-slate-50" />

            <DropdownMenuItem asChild>
              <Link
                href={ROUTES.ADMIN_NOTIFICATIONS}
                className="rounded-xl cursor-pointer py-2 px-3 text-center text-xs font-bold text-slate-750 justify-center hover:bg-slate-50 transition-colors w-full block"
              >
                Xem tất cả thông báo
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Settings Gear */}
        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50 size-9 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors" asChild>
          <Link href={ROUTES.ADMIN_SETTINGS}>
            <Settings className="h-4.5 w-4.5" />
          </Link>
        </Button>

        <div className="h-6 w-[1px] bg-slate-100 mx-1" />

        {/* User Account Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="pl-1.5 pr-2.5 py-1 h-10 rounded-xl gap-2 hover:bg-slate-50/80 active:scale-98 transition-all border border-transparent hover:border-slate-100 group"
            >
              <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shadow-3xs overflow-hidden relative shrink-0 group-hover:ring-2 group-hover:ring-slate-900/10 transition-all duration-300">
                {user?.avatar ? (
                  <Image
                    src={getImageUrl(user.avatar)}
                    alt={user.name || "User"}
                    width={28}
                    height={28}
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-slate-650 font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </span>
                )}
              </div>
              <div className="text-left hidden md:block space-y-0.5">
                <p className="text-[12px] font-bold text-slate-800 line-clamp-1 leading-none">
                  {user?.name || "Người dùng"}
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                  {ROLE_CONFIG[user?.role as Role]?.label ?? user?.role ?? "Người dùng"}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 mt-2.5 rounded-2xl p-2 shadow-2xl border border-slate-100 bg-white animate-in fade-in zoom-in-95 duration-200"
          >
            <DropdownMenuLabel className="font-bold text-[9px] tracking-wider text-slate-450 px-3 py-2 uppercase">
              Tài khoản
            </DropdownMenuLabel>

            <DropdownMenuItem asChild>
              <Link
                href={ROUTES.ADMIN_PROFILE}
                className="rounded-xl cursor-pointer py-2 px-3 flex items-center gap-2.5 focus:bg-slate-50 transition-colors group"
              >
                <UserIcon className="h-4 w-4 text-slate-400 group-focus:text-slate-800" />
                <span className="font-semibold text-xs text-slate-600 group-focus:text-slate-850">
                  Thông tin cá nhân
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={ROUTES.ADMIN_SETTINGS}
                className="rounded-xl cursor-pointer py-2 px-3 flex items-center gap-2.5 focus:bg-slate-50 transition-colors group"
              >
                <Shield className="h-4 w-4 text-slate-400 group-focus:text-slate-800" />
                <span className="font-semibold text-xs text-slate-600 group-focus:text-slate-850">
                  Cài đặt hệ thống
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1.5 bg-slate-50" />

            <DropdownMenuItem
              className="rounded-xl cursor-pointer py-2 px-3 text-rose-500 hover:bg-rose-50/50 focus:bg-rose-50/50 font-bold text-xs"
              onClick={logout}
            >
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
