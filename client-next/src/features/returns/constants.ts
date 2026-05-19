import { ReturnStatus } from "@/types/enums";

export const RETURN_STATUS_CONFIG = {
  [ReturnStatus.PENDING]: { 
    label: "Chờ duyệt", 
    color: "bg-amber-50 text-amber-600 border-amber-100" 
  },
  [ReturnStatus.APPROVED]: { 
    label: "Đã duyệt", 
    color: "bg-blue-50 text-blue-600 border-blue-100" 
  },
  [ReturnStatus.REJECTED]: { 
    label: "Từ chối", 
    color: "bg-rose-50 text-rose-600 border-rose-100" 
  },
  [ReturnStatus.RETURNING]: { 
    label: "Khách đang gửi hàng", 
    color: "bg-indigo-50 text-indigo-600 border-indigo-100" 
  },
  [ReturnStatus.RECEIVED]: { 
    label: "Shop đã nhận hàng", 
    color: "bg-cyan-50 text-cyan-600 border-cyan-100" 
  },
  [ReturnStatus.COMPLETED]: { 
    label: "Hoàn tất", 
    color: "bg-emerald-50 text-emerald-600 border-emerald-100" 
  },
} as const;

export const RETURNS_MESSAGES = {
  REASON_REQUIRED: "Vui lòng chọn hoặc nhập lý do đổi trả",
  CREATE_SUCCESS: "Gửi yêu cầu đổi trả thành công!",
  CREATE_ERROR: "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.",
  CONFIRM_SENT_SUCCESS: "Đã xác nhận gửi hàng thành công!",
  UPDATE_STATUS_SUCCESS: "Cập nhật trạng thái đổi trả thành công!",
  UPDATE_STATUS_ERROR: "Lỗi khi cập nhật trạng thái đổi trả",
} as const;
