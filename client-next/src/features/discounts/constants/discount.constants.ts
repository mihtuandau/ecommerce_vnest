export const DISCOUNT_TYPES = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
} as const;

export const DISCOUNT_TYPE_LABELS = {
  [DISCOUNT_TYPES.PERCENTAGE]: "Phần trăm (%)",
  [DISCOUNT_TYPES.FIXED]: "Số tiền cố định (₫)",
} as const;

export type DiscountType = keyof typeof DISCOUNT_TYPES;

/**
 * Flash Sale Constants
 */
export const FLASH_SALE_CONSTANTS = {
  // Countdown
  COUNTDOWN_INTERVAL: 1000, // Update countdown every 1 second

  // Status
  STATUS: {
    LIVE: "LIVE",
    SOON: "SOON",
    ENDED: "ENDED",
  } as const,

  STATUS_LABELS: {
    LIVE: "🔴 LIVE",
    SOON: "Sắp tới",
    ENDED: "Đã xong",
  } as const,

  // Default Pagination
  DEFAULT_LIMIT: 100,

  // Discount Display
  MAX_DISCOUNT_PERCENT: 70,
  DEFAULT_DISCOUNT_TEXT: "Ưu đãi sốc",
} as const;

export const FLASH_SALE_MESSAGES = {
  // Session Status
  SALE_LIVE: "Giảm đến {{percent}}%",
  ENDED: "Đã kết thúc",
  COMING_SOON: "Sắp tới",

  // UI Labels
  ALL_CATEGORIES: "Tất cả",
  SORT_BY_DISCOUNT: "Giảm nhiều nhất",
  SORT_BY_PRICE: "Giá thấp nhất",
  SORT_BY_SALES: "Bán chạy nhất",

  // Filter Labels
  FILTER_CATEGORY: "Danh mục",
  SORT_BY: "Sắp xếp",

  // No Data
  NO_PRODUCTS: "Không có sản phẩm trong phiên này",
  NO_SESSIONS: "Không có phiên flash sale nào",
} as const;

export const FLASH_SALE_SORT_OPTIONS = {
  MOST_DISCOUNT: "Giảm nhiều nhất",
  LOWEST_PRICE: "Giá thấp nhất",
  BEST_SELLERS: "Bán chạy nhất",
} as const;

