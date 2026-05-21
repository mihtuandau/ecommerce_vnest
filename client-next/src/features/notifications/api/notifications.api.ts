import { api } from "@/lib/http";
import type {
  NotificationSettings,
  NotificationsQueryParams,
} from "@/features/notifications/types";

export const notificationsApi = {
  getNotifications: async (params: NotificationsQueryParams = {}) => {
    const response = await api.get("/notifications", { params });
    return response.data;
  },

  markAsRead: async (id: number) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch("/notifications/mark-all-read");
    return response.data;
  },

  getSettings: async () => {
    const response = await api.get("/notifications/settings");
    return response.data;
  },

  updateSettings: async (settings: NotificationSettings) => {
    const response = await api.put("/notifications/settings", settings);
    return response.data;
  },
};
