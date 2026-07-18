/**
 * Cart Module Constants
 */

export const CART_CONSTANTS = {
  // UI
  DROPDOWN_TIMEOUT: 300, // Dropdown hide timeout in ms
  MAX_HEIGHT: "max-h-[580px]", // Max height for dropdown items list

  // Display
  EMPTY_STATE_ICON: "ShoppingBasket",
  DECIMAL_PLACES: 2,

  // Thresholds
  MIN_ITEM_COUNT: 1,
} as const;

export const CART_MESSAGES = {
  // Status
  EMPTY_CART: "Giỏ hàng của bạn trống",
  CONTINUE_SHOPPING: "Tiếp tục mua sắm",
  PROCEED_TO_CHECKOUT: "Thanh toán",
  VIEW_CART: "Xem giỏ hàng",

  // Item Actions
  REMOVE_ITEM: "Xoá",
  UPDATE_QUANTITY: "Cập nhật số lượng",
  OUT_OF_STOCK: "Hết hàng",

  // Labels
  SUBTOTAL: "Tạm tính",
  YOUR_CART: "Giỏ hàng của bạn",
  ITEMS_IN_CART: (count: number) => `${count} sản phẩm trong giỏ`,
} as const;

export const CART_PAGINATION = {
  DEFAULT_LIMIT: 50,
} as const;
