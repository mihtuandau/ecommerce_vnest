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
