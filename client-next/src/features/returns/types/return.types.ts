import type { ReturnStatus } from "@/types/enums";

export interface ReturnItem {
  id: number;
  orderId?: number;
  orderCode?: string;
  status: ReturnStatus | string;
  reason: string;
  details?: string;
  adminNote?: string;
  createdAt: string;
  order?: {
    id?: number;
    orderCode?: string;
    total?: number;
  };
  user?: {
    id?: string | number;
    name?: string;
    phone?: string;
    email?: string;
  };
}

export interface ReturnsQueryParams {
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateReturnRequestPayload {
  orderId: number;
  reason: string;
  items?: Record<string, unknown>[];
  details?: string;
  images?: string[];
}

export interface CreateGuestReturnRequestPayload {
  orderCode: string;
  contact: string;
  reason: string;
  items?: Record<string, unknown>[];
  details?: string;
  images?: string[];
}

export interface ConfirmGuestReturnSentPayload {
  orderCode: string;
  contact: string;
}

export interface UpdateReturnStatusPayload {
  id: number;
  status: ReturnStatus | string;
  adminNote?: string;
}
