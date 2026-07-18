/**
 * Banners Module Constants
 */

export const BANNERS_MESSAGES = {
  // Promotional Text
  SEASONAL_LABEL: "Mùa mới",
  NEW_COLLECTION: "Bộ sưu tập mới",
  LIMITED_TIME: "Thời gian hạn chế",
  EXCLUSIVE: "Độc quyền",

  // Call to Actions
  SHOP_NOW: "Mua ngay",
  VIEW_COLLECTION: "Xem bộ sưu tập",
  DISCOVER_MORE: "Khám phá thêm",
  LEARN_MORE: "Tìm hiểu thêm",
  EXPLORE: "Khám phá",

  // Button Text
  CTA_PRIMARY: "Mua ngay",
  CTA_SECONDARY: "Xem bộ sưu tập",

  // Banner Types
  HERO_BANNER: "Banner chính",
  PROMO_BANNER: "Banner khuyến mãi",
  SEASONAL_BANNER: "Banner theo mùa",
  COLLECTION_BANNER: "Banner bộ sưu tập",
} as const;

export const BANNERS_UI = {
  // Sizing
  BANNER_HEIGHT_MOBILE: "auto",
  BANNER_HEIGHT_DESKTOP: "auto",
  BADGE_PADDING: "px-4 py-1.5",
  BUTTON_PADDING: "px-12 py-4",

  // Border Radius
  BADGE_RADIUS: "rounded-full",
  BUTTON_RADIUS: "rounded-full",

  // Animation
  PULSE_DURATION: "animate-pulse",
  TRANSITION: "transition-all duration-300",
  HOVER_SCALE: "active:scale-95",

  // Z-index
  OVERLAY_Z: "inset-0",
} as const;

export const BANNERS_ANIMATION = {
  PULSE: "animate-pulse",
  FADE_IN: "animate-fade-in",
  SLIDE_UP: "slide-in-from-bottom",
  TRANSITION_DURATION: 300, // ms
} as const;

export const BANNERS_TYPOGRAPHY = {
  // Font Sizes
  BADGE_SIZE: "text-[11px]",
  BADGE_TEXT_TRANSFORM: "uppercase",
  BADGE_TRACKING: "tracking-[0.2em]",

  HEADING_SIZE: "text-4xl md:text-6xl lg:text-[4.5rem]",
  HEADING_FONT: "font-serif",
  HEADING_TRACKING: "tracking-tight",

  DESCRIPTION_SIZE: "text-[15px]",
  DESCRIPTION_LEADING: "leading-relaxed",

  BUTTON_SIZE: "text-[14px]",
  BUTTON_WEIGHT: "font-bold",
} as const;
