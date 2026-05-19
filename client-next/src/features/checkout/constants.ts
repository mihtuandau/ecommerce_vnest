/**
 * Checkout Module Constants
 */

export const CHECKOUT_CONSTANTS = {
  // Timeouts and Delays
  NOTIFICATION_TIMEOUT: 8000, // Hide notification after 8s
  SHIPPING_CALCULATION_DELAY: 500, // Debounce delay for shipping calculation

  // Calculations
  WEIGHT_MULTIPLIER: 1000, // Convert kg to grams
  DEFAULT_SHIPPING_FEE: 30000, // Default shipping fee in VND
  FREE_SHIPPING_THRESHOLD: 500000, // Free shipping if order > 500k VND

  // Payment Methods
  PAYMENT_METHODS: {
    COD: "COD", // Cash on Delivery
    VNPAY: "VNPAY",
    PAYPAL: "PAYPAL",
  } as const,

  PAYMENT_METHOD_LABELS: {
    COD: "Thanh toán khi nhận hàng (COD)",
    VNPAY: "VNPAY - Cổng thanh toán",
    PAYPAL: "PayPal",
  } as const,

  // External URLs should come from environment variables for security
  // See: process.env.NEXT_PUBLIC_VNPAY_LOGO_URL

  // Order Status
  ORDER_STATUS: {
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
  } as const,

  // Discount
  DISCOUNT: {
    MIN_AMOUNT: 0,
    MAX_DISCOUNT_PERCENT: 100,
  } as const,
} as const;

export const CHECKOUT_MESSAGES = {
  // Success Messages
  ORDER_SUCCESS: "Đặt hàng thành công!",
  DISCOUNT_APPLIED: "Áp dụng mã khuyến mãi thành công!",
  SHIPPING_FEE_CALCULATED: "Phí vận chuyển được tính toán",

  // Error Messages
  ORDER_ERROR: "Có lỗi khi đặt hàng. Vui lòng thử lại.",
  INVALID_DISCOUNT: "Mã khuyến mãi không hợp lệ",
  DISCOUNT_EXPIRED: "Mã khuyến mãi đã hết hạn",
  DISCOUNT_LIMIT_EXCEEDED: "Bạn đã sử dụng hết lượt khuyến mãi này",
  SHIPPING_FEE_ERROR: "Không thể tính phí vận chuyển",
  INVALID_ADDRESS: "Địa chỉ không hợp lệ",
  INVALID_PHONE: "Số điện thoại không hợp lệ",
  INVALID_EMAIL: "Email không hợp lệ",

  // Warning Messages
  ITEMS_REMOVED: "Một số sản phẩm đã bị xoá khỏi giỏ hàng",
  OUT_OF_STOCK: "Sản phẩm này hết hàng",
  STOCK_LIMITED: "Số lượng còn hạn",

  // Form Labels
  FULL_NAME: "Họ và tên",
  PHONE: "Số điện thoại",
  EMAIL: "Email",
  PROVINCE: "Tỉnh/Thành phố",
  DISTRICT: "Quận/Huyện",
  WARD: "Xã/Phường",
  STREET_ADDRESS: "Địa chỉ cụ thể",
  PAYMENT_METHOD: "Phương thức thanh toán",
  ORDER_NOTE: "Ghi chú đơn hàng",
  DISCOUNT_CODE: "Mã khuyến mãi",

  // Order Summary
  SUBTOTAL: "Tạm tính",
  SHIPPING_FEE: "Phí vận chuyển",
  DISCOUNT: "Giảm giá",
  TOTAL: "Tổng cộng",

  // Buttons
  APPLY_DISCOUNT: "Áp dụng",
  PLACE_ORDER: "Đặt hàng",
  CONTINUE_SHOPPING: "Tiếp tục mua sắm",
  BACK_TO_CART: "Quay lại giỏ hàng",

  // Placeholders
  ENTER_DISCOUNT_CODE: "Nhập mã khuyến mãi",
  ENTER_ORDER_NOTE: "Ghi chú thêm (không bắt buộc)",
} as const;

export const CHECKOUT_VALIDATION = {
  PHONE_REGEX: /^[0-9]{10,11}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MAX_NOTE_LENGTH: 500,
} as const;
