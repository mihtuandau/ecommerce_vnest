export interface NotificationsQueryParams {
  page?: number;
  limit?: number;
}

export interface NotificationSettings {
  orderStatus: boolean;
  security: boolean;
  promotions: boolean;
}

export interface NotificationItem {
  id: number;
  title?: string;
  message?: string;
  type?: "ORDER" | "SECURITY" | "SYSTEM" | string;
  isRead?: boolean;
  link?: string;
  createdAt?: string;
}
