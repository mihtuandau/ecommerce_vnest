"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useNotifications,
  useNotificationSettings,
  useUpdateNotificationSettings,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "../../hooks";
import { NotificationFilterType, NOTIFICATIONS_LIMITS } from "../../constants";
import { NotificationsToolbar } from "./NotificationsToolbar";
import { NotificationsList } from "./NotificationsList";
import { NotificationsPreferences } from "./NotificationsPreferences";

export function NotificationsContainer() {
  const [page, setPage] = useState(1);
  const [limit] = useState(NOTIFICATIONS_LIMITS.ADMIN);
  const [filterType, setFilterType] = useState<NotificationFilterType>("ALL");
  const router = useRouter();

  // Fetch notifications list
  const { data, isLoading, refetch, isFetching } = useNotifications({
    page,
    limit,
  });

  // Fetch notification settings
  const {
    data: settings = {},
    isLoading: isLoadingSettings,
    refetch: refetchSettings,
  } = useNotificationSettings();
  const updateSettingsMutation = useUpdateNotificationSettings();

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const allNotifications = data?.data || [];
  const meta = data?.meta || {
    total: 0,
    page: 1,
    limit: NOTIFICATIONS_LIMITS.ADMIN,
    totalPages: 1,
  };

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

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      markReadMutation.mutate(notif.id);
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  const handleToggleSetting = (key: "orderStatus" | "security" | "promotions") => {
    const nextSettings = {
      orderStatus: settings.orderStatus ?? true,
      security: settings.security ?? true,
      promotions: settings.promotions ?? true,
      [key]: !(settings[key] ?? true),
    };

    updateSettingsMutation.mutate(nextSettings);
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-slate-900 mb-1">
          Hộp thư thông báo vận hành
        </h1>
        <p className="text-slate-500 text-sm">
          Xem các cập nhật hệ thống, cảnh báo bảo mật và biến động trạng thái đơn hàng
          thời gian thực.
        </p>
      </div>

      
      <NotificationsToolbar
        filterType={filterType}
        setFilterType={setFilterType}
        unreadCount={unreadCount}
        isFetching={isFetching}
        refetch={refetch}
        handleMarkAllRead={handleMarkAllRead}
        isMarkingAllRead={markAllReadMutation.isPending}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <NotificationsList
          filteredNotifications={filteredNotifications}
          isLoading={isLoading}
          handleNotificationClick={handleNotificationClick}
          meta={meta}
          page={page}
          setPage={setPage}
        />

        
        <NotificationsPreferences
          settings={{
            orderStatus: settings.orderStatus ?? true,
            security: settings.security ?? true,
            promotions: settings.promotions ?? true,
          }}
          isLoadingSettings={isLoadingSettings}
          isUpdatingSettings={updateSettingsMutation.isPending}
          handleToggleSetting={handleToggleSetting}
        />
      </div>
    </div>
  );
}

// Aliasing for compatibility
export { NotificationsContainer as AdminNotificationsContainer };
