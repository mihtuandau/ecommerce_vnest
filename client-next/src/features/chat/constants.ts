export const DEFAULT_CHAT_SHORTCUTS = [
  // ── GENERAL CHAT & SUPPORT ──
  {
    key: "/chào",
    text: "Xin chào! Tôi là nhân viên hỗ trợ LUXE. Tôi có thể giúp gì cho bạn hôm nay?",
    label: "Lời chào hỏi",
  },
  {
    key: "/cảmơn",
    text: "Cảm ơn bạn đã liên hệ với LUXE! Rất vui được hỗ trợ bạn. Vấn đề của bạn đã được ghi nhận và chúng tôi sẽ xử lý trong thời gian sớm nhất.",
    label: "Lời cảm ơn",
  },

  // ── PRODUCTS & WARRANTY MODULE ──
  {
    key: "/tưvấn",
    text: "Chào bạn, bạn đang quan tâm đến dòng sản phẩm nào thế ạ? Hãy cung cấp chiều cao, cân nặng hoặc số đo của bạn để LUXE hỗ trợ tư vấn size chuẩn nhất nhé!",
    label: "Tư vấn chọn size",
  },
  {
    key: "/bảohành",
    text: "Dạ, tất cả sản phẩm chính hãng tại LUXE đều được hưởng chính sách bảo hành 12 tháng kể từ ngày nhận hàng. Bạn vui lòng giữ lại hóa đơn hoặc cung cấp mã đơn hàng để được hỗ trợ ạ.",
    label: "Chính sách bảo hành",
  },

  // ── ORDERS & SHIPPING MODULE ──
  {
    key: "/vậnchuyển",
    text: "Đơn hàng của bạn hiện đang được bàn giao cho đơn vị vận chuyển Giao Hàng Nhanh. Dự kiến hàng sẽ được giao tới bạn trong vòng 1-2 ngày làm việc.",
    label: "Thông tin vận chuyển",
  },
  {
    key: "/trađơn",
    text: "Dạ, bạn có thể kiểm tra trạng thái đơn hàng của mình tại mục 'Đơn mua' trong tài khoản cá nhân, hoặc gửi cho em mã đơn hàng để em kiểm tra trực tiếp giúp mình nhé!",
    label: "Tra cứu đơn hàng",
  },
  {
    key: "/hủyđơn",
    text: "Dạ, để hủy đơn hàng, bạn vui lòng cung cấp mã đơn hàng (ví dụ: #1002). Lưu ý đơn hàng chỉ có thể hủy nếu hệ thống chưa bàn giao cho bên vận chuyển ạ.",
    label: "Hướng dẫn hủy đơn",
  },
  {
    key: "/đổitrả",
    text: "Chính sách đổi trả của LUXE: Hỗ trợ đổi trả trong vòng 30 ngày kể từ ngày nhận hàng. Yêu cầu sản phẩm còn nguyên tem mác, hộp đựng và chưa qua sử dụng.",
    label: "Chính sách đổi trả",
  },

  // ── DISCOUNTS & PROMOTIONS MODULE ──
  {
    key: "/khuyếnmãi",
    text: "Dạ hiện tại LUXE đang có chương trình Flash Sale giảm giá đến 50% cùng nhiều voucher tích lũy hấp dẫn trong ví. Bạn nhớ thu thập và áp dụng ở bước Thanh toán nhé!",
    label: "Chương trình khuyến mãi",
  },

  // ── PAYMENTS MODULE ──
  {
    key: "/thanhtoán",
    text: "LUXE hỗ trợ các phương thức thanh toán linh hoạt: Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng qua mã QR nhanh, và Ví điện tử (Momo, VNPAY) vô cùng bảo mật.",
    label: "Phương thức thanh toán",
  },
] as const;

export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  MESSAGE: "message",
  ROOM_CREATED: "roomCreated",
} as const;

export const CHAT_STORAGE_KEYS = {
  HISTORY: "ai_chat_history",
  CONVERSATION_ID: "ai_conversation_id",
} as const;

// Socket Configuration
export const CHAT_SOCKET_CONSTANTS = {
  // Connection Settings
  RECONNECTION_ATTEMPTS: 15,
  RECONNECTION_DELAY: 1000, // 1 second
} as const;

// Transports - kept mutable for socket.io compatibility
export const CHAT_SOCKET_TRANSPORTS = ["websocket", "polling"];

export const CHAT_TIMEOUTS = {
  // Message & Product Interactions
  PRODUCT_FETCH_RETRY: 2000, // Retry fetching product info
  COPY_FEEDBACK: 2000, // Show copy feedback for 2s
  MESSAGE_TIMEOUT: 80, // Message animation timeout

  // Disconnect/Reconnect
  DISCONNECT_GRACE_PERIOD: 5000, // Wait before showing offline
} as const;

export const CHAT_MESSAGES = {
  // Connection Status
  CONNECTING: "Đang kết nối...",
  CONNECTED: "Đã kết nối",
  DISCONNECTED: "Mất kết nối",
  CONNECTION_ERROR: "Lỗi kết nối",

  // Chat Messages
  MESSAGE_SENT: "Tin nhắn đã được gửi",
  MESSAGE_ERROR: "Lỗi khi gửi tin nhắn",
  MESSAGE_DELIVERED: "Tin nhắn đã được giao",
  MESSAGE_SEEN: "Tin nhắn đã được đọc",

  // Product Interactions
  PRODUCT_ADDED: "Sản phẩm đã được thêm vào giỏ hàng",
  PRODUCT_ERROR: "Lỗi khi tải sản phẩm",
  COPIED: "Đã sao chép",
  COPY_FAILED: "Sao chép thất bại",

  // UI Labels
  TYPE_MESSAGE: "Nhập tin nhắn...",
  SEND: "Gửi",
  ATTACH_IMAGE: "Đính kèm hình ảnh",
  EMOJI: "Emoji",
} as const;

export const CHAT_MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  PRODUCT: "product",
  ORDER: "order",
  SYSTEM: "system",
} as const;

export const CHAT_EVENTS = {
  // Connection Events
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  // Message Events
  MESSAGE: "message",
  MESSAGE_RECEIVED: "message:received",
  MESSAGE_SENT: "message:sent",
  MESSAGE_READ: "message:read",
  MESSAGE_DELETED: "message:deleted",

  // Typing Events
  USER_TYPING: "user:typing",
  USER_STOP_TYPING: "user:stop_typing",

  // Room Events
  JOIN_ROOM: "room:join",
  LEAVE_ROOM: "room:leave",
  ROOM_UPDATED: "room:updated",
} as const;

export const CHAT_UI_CONSTANTS = {
  // Message Display
  MAX_MESSAGES_INITIAL: 50,
  MESSAGES_PER_PAGE: 30,

  // Images
  MAX_IMAGE_SIZE_MB: 5,
  ALLOWED_FORMATS: ["image/jpeg", "image/png", "image/webp"] as const,

  // Animation
  MESSAGE_ANIMATION_DURATION: 300,
} as const;
