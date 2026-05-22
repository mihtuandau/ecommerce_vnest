import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/features/notifications/api/index";
import type { NotificationsQueryParams } from "@/features/notifications/types";

export const useNotifications = (params: NotificationsQueryParams = {}) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => notificationsApi.getNotifications(params),
  });
};
