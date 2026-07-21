import { Payment, PaymentMethod, PaymentStatus } from '@prisma/client';

// Domain-facing alias — callers import this instead of reaching into
// '@prisma/client' directly, so the repository stays the single seam
// that's aware of Prisma's generated shape.
export type PaymentEntity = Payment;

export interface CreatePaymentData {
  orderId: number;
  method: PaymentMethod;
  status?: PaymentStatus;
  amount: number;
  transactionId?: string;
  paymentLink?: string | null;
}

export type UpdatePaymentData = Partial<
  Omit<CreatePaymentData, 'orderId'> & { refundAmount: number }
>;

export interface PaymentFilter {
  status?: PaymentStatus;
  method?: PaymentMethod;
}
