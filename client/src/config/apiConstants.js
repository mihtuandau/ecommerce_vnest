/**
 * API ENDPOINTS CONSTANTS
 * Tập trung quản lý tất cả các API endpoints
 */

// ============================================
// AUTH ENDPOINTS
// ============================================
export const AUTH_ENDPOINTS = {
  BASE: '/auth',
  ME: '/auth/me',
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  GOOGLE_LOGIN: '/auth/google',
};

// ============================================
// USER ENDPOINTS
// ============================================
export const USER_ENDPOINTS = {
  BASE: '/users',
  PROFILE: '/users/profile',
  BY_ID: (id) => `/users/${id}`,
  CHANGE_PASSWORD: '/user/change-password',
};

// ============================================
// PRODUCT ENDPOINTS
// ============================================
export const PRODUCT_ENDPOINTS = {
  BASE: '/products',
  PRICE_RANGE: '/products/price-range',
  BY_ID: (id) => `/products/${id}`,
  RELATED: (id) => `/products/${id}/related`,
  VIEW: (id) => `/products/${id}/view`,
  BULK_DELETE: '/products/bulk-delete',
  UPLOAD_IMAGE: '/products/upload-image',
};

// ============================================
// CATEGORY ENDPOINTS
// ============================================
export const CATEGORY_ENDPOINTS = {
  BASE: '/categories',
  BY_ID: (id) => `/categories/${id}`,
  UPLOAD_IMAGE: '/categories/upload-image',
};

// ============================================
// BRAND ENDPOINTS
// ============================================
export const BRAND_ENDPOINTS = {
  BASE: '/brands',
  BY_ID: (id) => `/brands/${id}`,
};

// ============================================
// CART ENDPOINTS
// ============================================
export const CART_ENDPOINTS = {
  BASE: '/cart',
  ITEMS: '/cart/items',
  ITEM_BY_VARIANT: (variantId) => `/cart/items/${variantId}`,
};

// ============================================
// ORDER ENDPOINTS
// ============================================
export const ORDER_ENDPOINTS = {
  BASE: '/orders',
  BY_ID: (id) => `/orders/${id}`,
  MY_ORDERS: '/orders/my-orders',
  GUEST_ORDER: '/orders/guest',
  GUEST_LOOKUP: (orderCode) => `/orders/guest/lookup/${orderCode}`,
  CANCEL: (id) => `/orders/${id}/cancel`,
};

// ============================================
// PAYMENT ENDPOINTS
// ============================================
export const PAYMENT_ENDPOINTS = {
  BASE: '/payments',
  BY_ID: (id) => `/payments/${id}`,
  PAYOS_INFO: (orderCode) => `/payments/payos/info/${orderCode}`,
  PAYOS_ORDER: (orderCode) => `/payments/payos/order/${orderCode}`,
  CANCEL: (paymentId) => `/payments/${paymentId}/cancel`,
  STATUS: (id) => `/payments/${id}/status`,
  STATS: '/payments/stats',
};

// ============================================
// ADDRESS ENDPOINTS
// ============================================
export const ADDRESS_ENDPOINTS = {
  BASE: '/addresses',
  BY_ID: (id) => `/addresses/${id}`,
  SET_DEFAULT: (id) => `/addresses/${id}/set-default`,
};

// ============================================
// BANNER ENDPOINTS
// ============================================
export const BANNER_ENDPOINTS = {
  BASE: '/banners',
  BY_ID: (id) => `/banners/${id}`,
  REORDER: (id) => `/banners/${id}/reorder`,
  UPLOAD_IMAGE: '/banners/upload-image',
};

// ============================================
// DISCOUNT ENDPOINTS
// ============================================
export const DISCOUNT_ENDPOINTS = {
  BASE: '/discounts',
  PUBLIC: '/discounts/public',
  FLASH_SALE: '/discounts/flash-sale',
  AUTO_APPLY: '/discounts/auto-apply',
  BY_ID: (id) => `/discounts/${id}`,
  VALIDATE: '/discounts/validate',
  STATS: '/discounts/stats',
};

// ============================================
// WISHLIST ENDPOINTS
// ============================================
export const WISHLIST_ENDPOINTS = {
  BASE: '/wishlist',
  COUNT: '/wishlist/count',
  BY_VARIANT: (variantId) => `/wishlist/${variantId}`,
  CHECK: (variantId) => `/wishlist/check/${variantId}`,
};

// ============================================
// REVIEW ENDPOINTS
// ============================================
export const REVIEW_ENDPOINTS = {
  BASE: '/reviews',
  BY_ID: (id) => `/reviews/${id}`,
  BY_PRODUCT: (productId) => `/reviews/product/${productId}`,
  MY_REVIEWS: '/reviews/my-reviews',
};

// ============================================
// CHAT ENDPOINTS
// ============================================
export const CHAT_ENDPOINTS = {
  ROOMS: '/chat/rooms',
  ROOM_BY_ID: (roomId) => `/chat/rooms/${roomId}`,
  MESSAGES: (roomId) => `/chat/rooms/${roomId}/messages`,
  SEND_MESSAGE: '/chat/send',
  MARK_READ: (roomId) => `/chat/rooms/${roomId}/mark-read`,
};

// ============================================
// CHATBOT ENDPOINTS
// ============================================
export const CHATBOT_ENDPOINTS = {
  CHAT: '/chatbot/chat',
  STATUS: '/chatbot/status',
};

// ============================================
// DASHBOARD ENDPOINTS
// ============================================
export const DASHBOARD_ENDPOINTS = {
  STATS: '/dashboard/stats',
  REVENUE: '/dashboard/revenue',
  RECENT_ORDERS: '/dashboard/recent-orders',
  TOP_PRODUCTS: '/dashboard/top-products',
};

// ============================================ 
// UPLOAD ENDPOINTS
// ============================================
export const UPLOAD_ENDPOINTS = {
  IMAGE: '/upload/image',
  IMAGES: '/upload/images',
};

// ============================================
// LOCATION ENDPOINTS (External API)
// ============================================
export const LOCATION_API = {
  BASE_URL: 'https://esgoo.net/api-tinhthanh',
};

export const LOCATION_ENDPOINTS = {
  ALL_PROVINCES: '/1/0.htm',
  DISTRICTS_BY_PROVINCE: (provinceId) => `/2/${provinceId}.htm`,
  WARDS_BY_DISTRICT: (districtId) => `/3/${districtId}.htm`,
};

// ============================================
// Helper function để tạo query string
// ============================================
export const buildQueryString = (params) => {
  const filtered = Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '');
  if (filtered.length === 0) return '';
  const queryString = filtered.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  return `?${queryString}`;
};

// ============================================
// Export tất cả endpoints
// ============================================
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  PRODUCT: PRODUCT_ENDPOINTS,
  CATEGORY: CATEGORY_ENDPOINTS,
  BRAND: BRAND_ENDPOINTS,
  CART: CART_ENDPOINTS,
  ORDER: ORDER_ENDPOINTS,
  PAYMENT: PAYMENT_ENDPOINTS,
  ADDRESS: ADDRESS_ENDPOINTS,
  BANNER: BANNER_ENDPOINTS,
  DISCOUNT: DISCOUNT_ENDPOINTS,
  WISHLIST: WISHLIST_ENDPOINTS,
  REVIEW: REVIEW_ENDPOINTS,
  CHAT: CHAT_ENDPOINTS,
  CHATBOT: CHATBOT_ENDPOINTS,
  DASHBOARD: DASHBOARD_ENDPOINTS,
  UPLOAD: UPLOAD_ENDPOINTS,
  LOCATION: LOCATION_ENDPOINTS,
};

export default API_ENDPOINTS;
