export interface NotificationsQueryParams {
  page?: number;
  limit?: number;
}

export interface NotificationSettings {
  orderStatus: boolean;
  security: boolean;
  promotions: boolean;
  newsletter?: boolean;
}

export interface NotificationItem {
  id: number;
  title?: string;
  content?: string;
  message?: string;
  type?: "ORDER" | "ORDER_STATUS" | "SECURITY" | "SYSTEM" | "PROMOTION" | string;
  isRead?: boolean;
  link?: string;
  createdAt?: string;
}
