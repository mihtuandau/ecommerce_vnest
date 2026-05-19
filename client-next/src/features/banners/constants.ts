/**
 * Banners Module Constants
 */

export const BANNERS_COLORS = {
  // Primary Palette
  PRIMARY_BG: "#FAF8F4", // Light beige background
  SECONDARY_BG: "#E8E0D0", // Medium beige
  ACCENT_COLOR: "#C4783A", // Bronze/Gold accent
  DARK_TEXT: "#3D2B1A", // Dark brown text
  LIGHT_TEXT: "#8A7966", // Light brown text
  BORDER_COLOR: "#DDD6C8", // Light border

  // Interactive
  BUTTON_PRIMARY: "#3D2B1A",
  BUTTON_PRIMARY_HOVER: "#C4783A",
  BUTTON_PRIMARY_TEXT: "#FAF8F4",
  BUTTON_SECONDARY_BORDER: "#DDD6C8",
  BUTTON_SECONDARY_BORDER_HOVER: "#C4783A",

  // Status Colors
  BADGE_BG: "#E8E0D0", // Badge background
  BADGE_BORDER: "#E8E0D0",
  PULSE_DOT: "#C4783A", // Pulsing indicator

  // Overlays & Effects
  OVERLAY_DARK: "#3D2B1A",
  OVERLAY_LIGHT: "rgba(255, 255, 255, 1)",
  SHADOW: "#3D2B1A",
} as const;

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
  HEADING_FONT: "font-serif-brand",
  HEADING_TRACKING: "tracking-tight",

  DESCRIPTION_SIZE: "text-[15px]",
  DESCRIPTION_LEADING: "leading-relaxed",

  BUTTON_SIZE: "text-[14px]",
  BUTTON_WEIGHT: "font-bold",
} as const;
