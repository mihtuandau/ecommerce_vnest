export const ORDERS_MESSAGES = {
  // General Labels
  ORDER_NUMBER: "Mã đơn hàng",
  ORDER_STATUS: "Trạng thái đơn hàng",
  ORDER_DATE: "Ngày đặt hàng",
  TOTAL_PRICE: "Tổng tiền",
  SHIPPING_ADDRESS: "Địa chỉ giao hàng",

  // Actions
  VIEW_DETAILS: "Xem chi tiết",
  CANCEL_ORDER: "Hủy đơn hàng",
  RETURN_PRODUCT: "Trả hàng",
  TRACK_SHIPMENT: "Theo dõi vận chuyển",
  CONTACT_SUPPORT: "Liên hệ hỗ trợ",
  REPORT_ISSUE: "Báo cáo vấn đề",

  // Status Messages
  ORDER_CONFIRMED: "Đơn hàng đã được xác nhận",
  ORDER_SHIPPED: "Đơn hàng đang vận chuyển",
  ORDER_DELIVERED: "Đơn hàng đã được giao",
  ORDER_CANCELLED: "Đơn hàng đã bị hủy",

  // Confirmations
  CANCEL_CONFIRMATION: "Bạn có chắc chắn muốn hủy đơn hàng này?",
  CANCEL_SUCCESS: "Đơn hàng đã được hủy thành công",
  CANCEL_ERROR: "Không thể hủy đơn hàng",

  // Guest Order
  GUEST_ORDER_LOOKUP: "Tra cứu đơn hàng",
  ENTER_ORDER_CODE: "Nhập mã đơn hàng",
  ENTER_PHONE: "Nhập số điện thoại",

  // Error Messages
  ORDER_NOT_FOUND: "Không tìm thấy đơn hàng",
  INVALID_ORDER_CODE: "Mã đơn hàng không hợp lệ",
  FETCH_ERROR: "Lỗi khi tải thông tin đơn hàng",
} as const;
