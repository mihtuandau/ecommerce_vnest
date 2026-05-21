"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationSettings,
  useNotifications,
  useUpdateNotificationSettings,
} from "@/features/notifications/hooks";
import {
  NotificationFilterType,
  NOTIFICATIONS_LIMITS,
} from "@/features/notifications/constants/index";
import type {
  NotificationItem,
  NotificationSettings,
} from "@/features/notifications/types";
import { NotificationsList } from "@/features/notifications/components/admin/NotificationsList";
import { NotificationsPreferences } from "@/features/notifications/components/admin/NotificationsPreferences";
import { NotificationsToolbar } from "@/features/notifications/components/admin/NotificationsToolbar";

export function AdminNotificationsView() {
  const [page, setPage] = useState(1);
  const [limit] = useState(NOTIFICATIONS_LIMITS.ADMIN);
  const [filterType, setFilterType] = useState<NotificationFilterType>("ALL");
  const router = useRouter();

  const { data, isLoading, refetch, isFetching } = useNotifications({
    page,
    limit,
  });

  const { data: settings = {}, isLoading: isLoadingSettings } =
    useNotificationSettings();
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

  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((notification: NotificationItem) => {
      if (filterType === "UNREAD") return !notification.isRead;
      if (filterType === "SYSTEM") return notification.type === "SYSTEM";
      if (filterType === "ORDER") return notification.type === "ORDER";
      if (filterType === "SECURITY") return notification.type === "SECURITY";
      return true;
    });
  }, [allNotifications, filterType]);

  const unreadCount = useMemo(() => {
    return allNotifications.filter(
      (notification: NotificationItem) => !notification.isRead
    ).length;
  }, [allNotifications]);

  const normalizedSettings: NotificationSettings = {
    orderStatus: settings.orderStatus ?? true,
    security: settings.security ?? true,
    promotions: settings.promotions ?? true,
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleToggleSetting = (key: keyof NotificationSettings) => {
    updateSettingsMutation.mutate({
      ...normalizedSettings,
      [key]: !normalizedSettings[key],
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-slate-900 mb-1">
          Hộp thư thông báo vận hành
        </h1>
        <p className="text-slate-500 text-sm">
          Xem các cập nhật hệ thống, cảnh báo bảo mật và biến động trạng thái
          đơn hàng thời gian thực.
        </p>
      </div>

      <NotificationsToolbar
        filterType={filterType}
        setFilterType={setFilterType}
        unreadCount={unreadCount}
        isFetching={isFetching}
        refetch={refetch}
        handleMarkAllRead={() => markAllReadMutation.mutate()}
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
          settings={normalizedSettings}
          isLoadingSettings={isLoadingSettings}
          isUpdatingSettings={updateSettingsMutation.isPending}
          handleToggleSetting={handleToggleSetting}
        />
      </div>
    </div>
  );
}
