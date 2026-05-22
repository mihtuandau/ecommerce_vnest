import type { Payment } from "@/types/models";

export interface PaymentsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  method?: string;
  search?: string;
}

export interface CreatePaymentPayload {
  orderId: number;
  method: string;
}

export interface UpdatePaymentStatusPayload {
  id: number;
  status: string;
}

export type PaymentRecord = Payment & {
  transactionId?: string;
  order?: {
    orderCode?: string;
    guestEmail?: string;
    user?: {
      name?: string;
    };
  };
};
