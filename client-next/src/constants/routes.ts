/**
 * Centralized route paths — prevents magic strings throughout the app.
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Customer
  PRODUCTS: "/",
  PRODUCT_DETAIL: (slug: string) => `/${slug}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  ACCOUNT: "/account",
  WISHLIST: "/wishlist",

  // Admin
  ADMIN: "/admin",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_USERS: "/admin/users",
  ADMIN_DISCOUNTS: "/admin/discounts",
  ADMIN_BANNERS: "/admin/banners",
  ADMIN_CHAT: "/admin/chat",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_SETTINGS: "/admin/settings",
} as const;
