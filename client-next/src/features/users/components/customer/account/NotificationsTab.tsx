"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Info,
  CheckCircle2,
  ShoppingBag,
  ShieldAlert,
  Settings,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/features/notifications/hooks";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/Skeleton";

type SubTab = "inbox" | "settings";

export function NotificationsTab() {
  const { success, error } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("inbox");
  const { data: settingsData, isLoading: isLoadingSettings } =
    useNotificationSettings();

  const [page, setPage] = useState(1);
  const { data: notificationsData, isLoading: isLoadingNotifs } = useNotifications({
    limit: 10,
    page,
  });

  const updateSettings = useUpdateNotificationSettings();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const meta = (notificationsData as any)?.meta;

  useEffect(() => {
    if (notificationsData?.data) {
      if (page === 1) {
        setAllNotifications(notificationsData.data);
      } else {
        setAllNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const newItems = notificationsData.data.filter(
            (n: any) => !existingIds.has(n.id)
          );
          return [...prev, ...newItems];
        });
      }
    }
  }, [notificationsData, page]);

  const [localSettings, setLocalSettings] = useState({
    orderStatus: true,
    promotions: true,
    newsletter: false,
    security: true,
  });

  useEffect(() => {
    if (settingsData) {
      setLocalSettings({
        orderStatus: settingsData.orderStatus ?? true,
        promotions: settingsData.promotions ?? true,
        newsletter: settingsData.newsletter ?? false,
        security: settingsData.security ?? true,
      });
    }
  }, [settingsData]);

  const toggleSetting = (key: keyof typeof localSettings) => {
    setLocalSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = () => {
    updateSettings.mutate(localSettings, {
      onSuccess: () => success("Đã lưu cài đặt thông báo"),
      onError: () => error("Không thể lưu cài đặt"),
    });
  };

  const unreadCount = allNotifications.filter((n: any) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "ORDER_STATUS":
        return <ShoppingBag size={18} className="text-blue-500" />;
      case "SECURITY":
        return <ShieldAlert size={18} className="text-red-500" />;
      case "PROMOTION":
        return <CheckCircle2 size={18} className="text-emerald-500" />;
      default:
        return <Bell size={18} className="text-brand-bronze" />;
    }
  };

  const notificationOptions = [
    {
      key: "orderStatus",
      title: "Trạng thái đơn hàng",
      desc: "Cập nhật khi đơn hàng đang giao hoặc đã hoàn tất",
    },
    {
      key: "promotions",
      title: "Khuyến mãi & Ưu đãi",
      desc: "Thông báo về mã giảm giá và các sự kiện Flash Sale",
    },
    {
      key: "newsletter",
      title: "Bản tin LUXE",
      desc: "Cập nhật xu hướng thời trang và bộ sưu tập mới",
    },
    {
      key: "security",
      title: "Bảo mật tài khoản",
      desc: "Thông báo khi có đăng nhập từ thiết bị lạ",
    },
  ];

  const handleLoadMore = () => {
    if (meta && page < meta.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  if (isLoadingSettings || (isLoadingNotifs && page === 1)) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── SUB-TABS NAVIGATION ── */}
      <div className="flex gap-1 p-1 bg-brand-ivory/30 rounded-2xl border border-brand-sand/50 w-fit">
        <button
          onClick={() => setActiveSubTab("inbox")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all",
            activeSubTab === "inbox"
              ? "bg-white text-brand-espresso shadow-sm"
              : "text-brand-taupe hover:text-brand-espresso"
          )}
        >
          <Inbox size={16} />
          Hộp thư
          {unreadCount > 0 && <span className="ml-1 w-2 h-2 rounded-full bg-red-500" />}
        </button>
        <button
          onClick={() => setActiveSubTab("settings")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all",
            activeSubTab === "settings"
              ? "bg-white text-brand-espresso shadow-sm"
              : "text-brand-taupe hover:text-brand-espresso"
          )}
        >
          <Settings size={16} />
          Thiết lập
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeSubTab === "inbox" ? (
          /* ── INBOX VIEW ── */
          <div className="bg-white border border-brand-sand rounded-[24px] overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-brand-sand/50 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-brand-espresso">
                Thông báo của tôi
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="text-[12px] font-bold text-brand-bronze hover:underline"
                >
                  Đọc tất cả
                </button>
              )}
            </div>

            <div className="divide-y divide-brand-sand/30">
              {allNotifications.length === 0 ? (
                <div className="py-24 text-center px-4">
                  <div className="w-16 h-16 bg-brand-ivory rounded-full flex items-center justify-center mx-auto mb-4 opacity-40">
                    <Bell size={32} className="text-brand-taupe" />
                  </div>
                  <p className="text-[14px] font-medium text-brand-taupe">
                    Hộp thư hiện đang trống
                  </p>
                </div>
              ) : (
                <>
                  {allNotifications.map((n: any) => (
                    <div
                      key={n.id}
                      onClick={() => !n.isRead && markRead.mutate(n.id)}
                      className={cn(
                        "p-6 flex gap-4 transition-all hover:bg-brand-ivory/10 cursor-pointer",
                        !n.isRead ? "bg-brand-cream/10" : ""
                      )}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center shrink-0 border",
                          !n.isRead
                            ? "bg-white border-brand-sand"
                            : "bg-brand-ivory/50 border-transparent"
                        )}
                      >
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p
                            className={cn(
                              "text-[14px] leading-snug",
                              !n.isRead
                                ? "font-bold text-brand-espresso"
                                : "font-medium text-brand-taupe"
                            )}
                          >
                            {n.title}
                          </p>
                          <span className="text-[11px] text-brand-taupe/60 whitespace-nowrap ml-4">
                            {new Date(n.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <p
                          className={cn(
                            "text-[13px] leading-relaxed",
                            !n.isRead ? "text-brand-espresso/90" : "text-brand-taupe/80"
                          )}
                        >
                          {n.content}
                        </p>
                      </div>
                    </div>
                  ))}

                  {meta && page < meta.totalPages && (
                    <div className="p-6 text-center border-t border-brand-sand/30 bg-brand-ivory/5">
                      <Button
                        variant="ghost"
                        onClick={handleLoadMore}
                        disabled={isLoadingNotifs}
                        className="text-[13px] font-bold text-brand-espresso hover:bg-brand-sand/20 px-8 rounded-full"
                      >
                        {isLoadingNotifs ? (
                          <Spinner size="sm" />
                        ) : (
                          "Xem thêm thông báo cũ"
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          /* ── SETTINGS VIEW ── */
          <div className="max-w-2xl">
            <div className="bg-white border border-brand-sand rounded-[24px] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-brand-sand/50">
                <h3 className="text-[15px] font-bold text-brand-espresso">
                  Cấu hình nhận tin
                </h3>
                <p className="text-[12px] text-brand-taupe mt-1">
                  Chọn loại thông báo bạn muốn nhận qua ứng dụng
                </p>
              </div>
              <div className="divide-y divide-brand-sand/30">
                {notificationOptions.map((n) => (
                  <div
                    key={n.key}
                    className="p-6 flex items-center justify-between hover:bg-brand-ivory/10 transition-all cursor-pointer"
                    onClick={() => toggleSetting(n.key as any)}
                  >
                    <div className="pr-8">
                      <p className="text-[14px] font-bold text-brand-espresso">
                        {n.title}
                      </p>
                      <p className="text-[12px] text-brand-taupe mt-0.5">{n.desc}</p>
                    </div>
                    <div
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0",
                        localSettings[n.key as keyof typeof localSettings]
                          ? "bg-emerald-500"
                          : "bg-brand-sand"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm",
                          localSettings[n.key as keyof typeof localSettings]
                            ? "translate-x-5"
                            : ""
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-brand-ivory/10 border-t border-brand-sand/50 flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  disabled={updateSettings.isPending}
                  className="rounded-full px-10 bg-brand-espresso text-white hover:bg-brand-espresso/90"
                >
                  {updateSettings.isPending ? (
                    <Spinner size="sm" variant="white" />
                  ) : (
                    "Cập nhật thay đổi"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
