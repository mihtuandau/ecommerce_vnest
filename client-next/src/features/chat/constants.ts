export const DEFAULT_CHAT_SHORTCUTS = [
  { 
    key: "/chào", 
    text: "Xin chào! Tôi là nhân viên hỗ trợ LUXE. Tôi có thể giúp gì cho bạn hôm nay?", 
    label: "Lời chào hỏi" 
  },
  { 
    key: "/cảmơn", 
    text: "Cảm ơn bạn đã liên hệ với LUXE! Rất vui được hỗ trợ bạn. Vấn đề của bạn đã được ghi nhận và chúng tôi sẽ xử lý trong thời gian sớm nhất.", 
    label: "Lời cảm ơn" 
  },
  { 
    key: "/vậnchuyển", 
    text: "Đơn hàng của bạn hiện đang được vận chuyển bởi Giao Hàng Nhanh. Dự kiến giao trong 1-2 ngày làm việc.", 
    label: "Thông tin vận chuyển" 
  },
  { 
    key: "/đổitrả", 
    text: "Chính sách đổi trả của LUXE: Trong vòng 30 ngày kể từ ngày nhận hàng. Sản phẩm còn nguyên tem, chưa qua sử dụng.", 
    label: "Chính sách đổi trả" 
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
