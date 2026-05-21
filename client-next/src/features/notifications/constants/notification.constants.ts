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

export const NOTIFICATIONS_LIMITS = {
  BELL: 5,
  TAB: 10,
  ADMIN: 15,
  BULK_FETCH: 50,
} as const;

export const NOTIFICATIONS_TIMEOUTS = {
  NOTIFICATION: 5000,
  ANIMATION: 300,
} as const;

export const NOTIFICATIONS_MESSAGES = {
  NOTIFICATIONS: "Thông báo",
  NO_NOTIFICATIONS: "Không có thông báo",
  MARK_AS_READ: "Đánh dấu là đã đọc",
  MARK_ALL_AS_READ: "Đánh dấu tất cả là đã đọc",
  DELETE: "Xóa",
  DELETE_ALL: "Xóa tất cả",
  VIEW: "Xem",
  DISMISS: "Bỏ qua",
  SETTING: "Cài đặt thông báo",
  UNREAD: "Chưa đọc",
  READ: "Đã đọc",
  EMPTY_NOTIFICATIONS: "Bạn không có thông báo nào",
  EMPTY_READ: "Chưa có thông báo đã đọc",
  EMPTY_UNREAD: "Không có thông báo chưa đọc",
} as const;

export const NOTIFICATIONS_PREFERENCE_OPTIONS = [
  {
    key: "orderStatus",
    title: "Biến động đơn hàng",
    description: "Nhận thông báo khi có đơn hàng mới hoặc đổi trả.",
  },
  {
    key: "security",
    title: "Nhật ký bảo mật",
    description: "Cảnh báo hoạt động đáng ngờ từ thiết bị lạ.",
  },
  {
    key: "promotions",
    title: "Chiến dịch khuyến mãi",
    description: "Thông báo các chương trình flash sale bắt đầu.",
  },
] as const;
