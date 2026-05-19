export const NOTIFICATION_TYPES = {
  ORDER: "ORDER",
  SECURITY: "SECURITY",
  SYSTEM: "SYSTEM",
} as const;

export const NOTIFICATION_FILTER_TYPES = {
  ALL: "ALL",
  UNREAD: "UNREAD",
  ORDER: "ORDER",
  SECURITY: "SECURITY",
  SYSTEM: "SYSTEM",
} as const;

export type NotificationFilterType = keyof typeof NOTIFICATION_FILTER_TYPES;

// Pagination Limits
export const NOTIFICATIONS_LIMITS = {
  BELL: 5, // Show last 5 notifications in bell dropdown
  TAB: 10, // Notifications tab/page listing
  ADMIN: 15, // Admin notifications container
  BULK_FETCH: 50, // Fetch up to 50 for caching
} as const;

export const NOTIFICATIONS_TIMEOUTS = {
  NOTIFICATION: 5000, // Auto-dismiss notification after 5s
  ANIMATION: 300,
} as const;

export const NOTIFICATIONS_MESSAGES = {
  // Labels
  NOTIFICATIONS: "Thông báo",
  NO_NOTIFICATIONS: "Không có thông báo",
  MARK_AS_READ: "Đánh dấu là đã đọc",
  MARK_ALL_AS_READ: "Đánh dấu tất cả là đã đọc",
  DELETE: "Xóa",
  DELETE_ALL: "Xóa tất cả",
  
  // Actions
  VIEW: "Xem",
  DISMISS: "Bỏ qua",
  SETTING: "Cài đặt thông báo",
  
  // Status
  UNREAD: "Chưa đọc",
  READ: "Đã đọc",
  
  // Empty State
  EMPTY_NOTIFICATIONS: "Bạn không có thông báo nào",
  EMPTY_READ: "Chưa có thông báo đã đọc",
  EMPTY_UNREAD: "Không có thông báo chưa đọc",
} as const;

export const NOTIFICATIONS_PREFERENCE_OPTIONS = [
  {
    key: "orderStatus",
    title: "Biến động Đơn hàng",
    description: "Nhận thông báo khi có đơn hàng mới hoặc đổi trả.",
  },
  {
    key: "security",
    title: "Nhật ký Bảo mật",
    description: "Cảnh báo hoạt động đáng ngờ từ thiết bị lạ.",
  },
  {
    key: "promotions",
    title: "Chiến dịch Khuyến mãi",
    description: "Thông báo các chương trình flash sale bắt đầu.",
  },
] as const;
