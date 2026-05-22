import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/features/notifications/api/index";

export const useNotificationSettings = () => {
  return useQuery({
    queryKey: ["notification-settings"],
    queryFn: () => notificationsApi.getSettings(),
  });
};
