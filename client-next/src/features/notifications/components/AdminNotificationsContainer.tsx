"use client";

import React, { useState, useMemo } from "react";
import { 
  Bell, BellOff, CheckCheck, RefreshCw, 
  ChevronLeft, ChevronRight, ShoppingCart, 
  ShieldAlert, Settings, Info, Calendar, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { 
  useNotifications, 
  useMarkNotificationRead, 
  useMarkAllNotificationsRead,
  useNotificationSettings,
  useUpdateNotificationSettings
} from "../hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import Link from "next/link";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export function AdminNotificationsContainer() {
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [filterType, setFilterType] = useState<"ALL" | "UNREAD" | "SYSTEM" | "ORDER" | "SECURITY">("ALL");
  const router = useRouter();

  // Fetch notifications list
  const { data, isLoading, refetch, isFetching } = useNotifications({
    page,
    limit,
  });

  // Fetch notification settings
  const { data: settings = {}, isLoading: isLoadingSettings, refetch: refetchSettings } = useNotificationSettings();
  const updateSettingsMutation = useUpdateNotificationSettings();

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const allNotifications = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 15, totalPages: 1 };

  // Local filtering based on active tab
  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((n: any) => {
      if (filterType === "UNREAD") return !n.isRead;
      if (filterType === "SYSTEM") return n.type === "SYSTEM";
      if (filterType === "ORDER") return n.type === "ORDER";
      if (filterType === "SECURITY") return n.type === "SECURITY";
      return true;
    });
  }, [allNotifications, filterType]);

  const unreadCount = useMemo(() => {
    return allNotifications.filter((n: any) => !n.isRead).length;
  }, [allNotifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50 shadow-xs shrink-0">
            <ShoppingCart size={18} />
          </div>
        );
      case "SECURITY":
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/50 shadow-xs shrink-0">
            <ShieldAlert size={18} />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50 shadow-xs shrink-0">
            <Bell size={18} />
          </div>
        );
    }
  };

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      markReadMutation.mutate(notif.id);
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  const handleToggleSetting = (key: string) => {
    const nextSettings = {
      ...settings,
      [key]: !settings[key],
    };
    updateSettingsMutation.mutate(nextSettings, {
      onSuccess: () => refetchSettings(),
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Bell className="h-7 w-7 text-indigo-600" />
            Trung tâm thông báo quản trị
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-1.5 leading-relaxed max-w-xl">
            Theo dõi, cập nhật các biến động về đơn hàng mới, các hoạt động bảo mật tài khoản và hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-xl font-bold uppercase text-[10px] tracking-wider text-emerald-600 border-emerald-250 bg-emerald-50/20 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
            >
              <CheckCheck className="h-3.5 w-3.5 mr-2" />
              Đọc tất cả
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-xl font-bold uppercase text-[10px] tracking-wider text-slate-600 border-slate-200 shadow-sm hover:border-slate-300"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={cn("h-3.5 w-3.5 mr-2 text-slate-500", isFetching && "animate-spin")} />
            Làm mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Filter Tabs & List */}
        <div className="lg:col-span-8 space-y-5">
          {/* Filtering Tab buttons */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-550/30 rounded-2xl border border-slate-100 max-w-2xl">
            <button
              onClick={() => setFilterType("ALL")}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer",
                filterType === "ALL" ? "bg-white text-slate-800 shadow-sm" : "text-slate-450 hover:text-slate-700"
              )}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType("UNREAD")}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
                filterType === "UNREAD" ? "bg-white text-slate-800 shadow-sm" : "text-slate-450 hover:text-slate-700"
              )}
            >
              Chưa đọc
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-indigo-650 inline-block animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setFilterType("ORDER")}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer",
                filterType === "ORDER" ? "bg-white text-slate-800 shadow-sm" : "text-slate-450 hover:text-slate-700"
              )}
            >
              Đơn hàng
            </button>
            <button
              onClick={() => setFilterType("SECURITY")}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer",
                filterType === "SECURITY" ? "bg-white text-slate-800 shadow-sm" : "text-slate-450 hover:text-slate-700"
              )}
            >
              Bảo mật
            </button>
            <button
              onClick={() => setFilterType("SYSTEM")}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer",
                filterType === "SYSTEM" ? "bg-white text-slate-800 shadow-sm" : "text-slate-450 hover:text-slate-700"
              )}
            >
              Hệ thống
            </button>
          </div>

          {/* List display */}
          <Card className="border-slate-100 rounded-2xl shadow-sm bg-white overflow-hidden">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-3">
                  <Spinner size="lg" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang tải thông báo...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center justify-center">
                  <BellOff className="h-12 w-12 text-slate-200 mb-4" />
                  <h3 className="text-base font-bold text-slate-800">Hộp thư thông báo trống</h3>
                  <p className="text-xs text-slate-450 mt-1 max-w-sm">
                    Hiện tại không có thông báo nào mới thuộc danh mục đã chọn.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredNotifications.map((notif: any) => {
                    const relative = dayjs(notif.createdAt).fromNow();
                    const formattedTime = dayjs(notif.createdAt).format("HH:mm - DD/MM/YYYY");

                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={cn(
                          "p-5 flex gap-4 items-start cursor-pointer hover:bg-slate-550/30 transition-all duration-200 border-l-[3px]",
                          notif.isRead 
                            ? "border-l-transparent bg-white" 
                            : "border-l-indigo-650 bg-indigo-50/10"
                        )}
                      >
                        {getNotificationIcon(notif.type)}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <h4 className={cn("text-xs truncate", notif.isRead ? "text-slate-700 font-semibold" : "text-slate-900 font-bold")}>
                              {notif.title}
                            </h4>
                            <span className="text-[9px] font-medium text-slate-400 shrink-0 whitespace-nowrap">
                              {relative}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                            {notif.content}
                          </p>
                          <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} className="text-slate-400" />
                              {formattedTime}
                            </span>
                            {notif.link && (
                              <span className="text-indigo-650 hover:underline flex items-center gap-0.5 font-bold uppercase text-[9px] tracking-wider">
                                Xem chi tiết <ArrowRight size={10} />
                              </span>
                            )}
                          </div>
                        </div>

                        {!notif.isRead && (
                          <div className="w-2.5 h-2.5 rounded-full bg-indigo-650 self-center shrink-0 shadow-sm" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>

            {/* Pagination footer */}
            {meta.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 rounded-lg border-slate-200 text-slate-500 hover:text-primary transition-all disabled:opacity-50"
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Trang trước
                </Button>
                <span className="text-xs font-bold text-slate-500">Trang {page} / {meta.totalPages}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 rounded-lg border-slate-200 text-slate-500 hover:text-primary transition-all disabled:opacity-50"
                  onClick={() => setPage(p => Math.min(p + 1, meta.totalPages))}
                  disabled={page === meta.totalPages}
                >
                  Trang sau
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Preference Settings */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-100 rounded-2xl shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Settings size={16} className="text-slate-500" />
                Cấu hình thông báo cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <p className="text-xs text-slate-450 leading-relaxed font-medium">
                Tự động lọc hoặc bật tắt các kênh thông báo tự động được phát bởi hệ thống Vnest.
              </p>

              {isLoadingSettings ? (
                <div className="py-10 flex items-center justify-center">
                  <Spinner size="md" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Toggle order status */}
                  <div className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">Biến động Đơn hàng</p>
                      <p className="text-[10px] text-slate-450 font-medium">Nhận thông báo khi có đơn hàng mới hoặc đổi trả.</p>
                    </div>
                    <button
                      onClick={() => handleToggleSetting("orderStatus")}
                      disabled={updateSettingsMutation.isPending}
                      className={cn(
                        "w-11 h-6 rounded-full transition-all duration-200 relative focus:outline-none cursor-pointer border shadow-sm",
                        settings.orderStatus 
                          ? "bg-indigo-600 border-indigo-650" 
                          : "bg-slate-200 border-slate-250"
                      )}
                    >
                      <span className={cn(
                        "w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-all shadow-xs",
                        settings.orderStatus ? "right-0.5" : "left-0.5"
                      )} />
                    </button>
                  </div>

                  {/* Toggle security */}
                  <div className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">Nhật ký Bảo mật</p>
                      <p className="text-[10px] text-slate-450 font-medium">Cảnh báo hoạt động đáng ngờ từ thiết bị lạ.</p>
                    </div>
                    <button
                      onClick={() => handleToggleSetting("security")}
                      disabled={updateSettingsMutation.isPending}
                      className={cn(
                        "w-11 h-6 rounded-full transition-all duration-200 relative focus:outline-none cursor-pointer border shadow-sm",
                        settings.security 
                          ? "bg-indigo-600 border-indigo-650" 
                          : "bg-slate-200 border-slate-250"
                      )}
                    >
                      <span className={cn(
                        "w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-all shadow-xs",
                        settings.security ? "right-0.5" : "left-0.5"
                      )} />
                    </button>
                  </div>

                  {/* Toggle promotions */}
                  <div className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">Chiến dịch Khuyến mãi</p>
                      <p className="text-[10px] text-slate-450 font-medium">Thông báo các chương trình flash sale bắt đầu.</p>
                    </div>
                    <button
                      onClick={() => handleToggleSetting("promotions")}
                      disabled={updateSettingsMutation.isPending}
                      className={cn(
                        "w-11 h-6 rounded-full transition-all duration-200 relative focus:outline-none cursor-pointer border shadow-sm",
                        settings.promotions 
                          ? "bg-indigo-600 border-indigo-650" 
                          : "bg-slate-200 border-slate-250"
                      )}
                    >
                      <span className={cn(
                        "w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-all shadow-xs",
                        settings.promotions ? "right-0.5" : "left-0.5"
                      )} />
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick instructions widget */}
          <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 flex gap-3.5 items-start">
            <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-indigo-950">Thông báo tự động</h5>
              <p className="text-[10px] leading-relaxed text-indigo-900/70 font-medium">
                Vnest tự động gửi thông báo thời gian thực về thiết bị của nhân viên trực qua kết nối WebSocket cao cấp khi có biến động vận hành.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
