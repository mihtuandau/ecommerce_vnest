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
import { Badge } from "@/components/ui/Badge";
import { useNotifications, useMarkNotificationRead } from "@/features/notifications/hooks";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

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
    <header className="h-20 border-b bg-card px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm font-sans">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Tìm kiếm nhanh... (Ctrl + K)"
            className="pl-10 h-10 bg-muted/50 border-none focus-visible:ring-primary rounded-xl"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded border bg-background text-xs font-mono text-muted-foreground">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1 font-bold text-[10px] tracking-widest uppercase shadow-sm">
          Admin Mode
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex items-center gap-2 rounded-xl h-10 border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 transition-all font-semibold"
          asChild
        >
          <Link href="/" target="_blank">
            <Globe className="h-4 w-4" />
            Xem cửa hàng
            <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
          </Link>
        </Button>

        <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden md:block" />

        {/* Live Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl transition-colors text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-destructive border-2 border-card text-[8px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 mt-2 rounded-2xl p-2 shadow-2xl border-muted/50 bg-white animate-in fade-in zoom-in-95 duration-200 space-y-1"
          >
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-50">
              <span className="font-bold text-xs tracking-wider text-slate-800 uppercase">Thông báo mới</span>
              {unreadCount > 0 && (
                <span className="text-[9px] bg-indigo-50 text-indigo-650 px-1.5 py-0.5 rounded-full font-bold">
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
                      "p-3 cursor-pointer hover:bg-slate-50 transition-all rounded-xl flex gap-2.5 items-start",
                      !n.isRead && "bg-indigo-50/10"
                    )}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      !n.isRead ? "bg-indigo-600 animate-pulse" : "bg-transparent"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[11px] truncate", !n.isRead ? "text-slate-800 font-bold" : "text-slate-500 font-medium")}>
                        {n.title}
                      </p>
                      <p className="text-[10px] text-slate-450 truncate mt-0.5 font-medium">
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
                href="/admin/notifications"
                className="rounded-xl cursor-pointer py-2 px-3 text-center text-xs font-bold text-indigo-650 justify-center focus:bg-indigo-50/50 w-full block"
              >
                Xem tất cả thông báo
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="rounded-xl transition-colors">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>

        <div className="h-8 w-[1px] bg-muted mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="pl-1 pr-3 py-1 h-12 rounded-2xl gap-3 hover:bg-muted transition-all"
            >
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || "User"}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-primary font-semibold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold leading-none text-slate-800">
                  {user?.name || "Người dùng"}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {(
                    {
                      ADMIN: "Quản trị viên",
                      KHO: "Quản lý kho",
                      BAN_HANG: "Bán hàng",
                      CUSTOMER: "Khách hàng",
                    } as Record<string, string>
                  )[(user as any)?.role] ??
                    (user as any)?.role ??
                    "Người dùng"}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-60 mt-2 rounded-2xl p-2 shadow-2xl border-muted/50 bg-white animate-in fade-in zoom-in-95 duration-200"
          >
            <DropdownMenuLabel className="font-semibold text-xs tracking-widest text-slate-500 px-3 py-3 uppercase">
              Tài khoản
            </DropdownMenuLabel>

            <DropdownMenuItem asChild>
              <Link
                href="/admin/profile"
                className="rounded-xl cursor-pointer py-2.5 px-3 flex items-center gap-3 focus:bg-slate-100 transition-colors group"
              >
                <UserIcon className="h-4 w-4 text-slate-500 group-focus:text-slate-900" />
                <span className="font-medium text-sm text-slate-700 group-focus:text-slate-900">
                  Thông tin cá nhân
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/admin/settings"
                className="rounded-xl cursor-pointer py-2.5 px-3 flex items-center gap-3 focus:bg-slate-100 transition-colors group"
              >
                <Shield className="h-4 w-4 text-slate-500 group-focus:text-slate-900" />
                <span className="font-medium text-sm text-slate-700 group-focus:text-slate-900">
                  Cài đặt hệ thống
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2 bg-slate-100" />

            <DropdownMenuItem
              className="rounded-xl cursor-pointer py-2.5 px-3 text-rose-500 focus:bg-rose-50 focus:text-white font-semibold text-sm"
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
