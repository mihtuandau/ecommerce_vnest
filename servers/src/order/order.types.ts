import { OrderStatus, PaymentStatus } from '@prisma/client';

// Order's create/update payloads are deeply dynamic (many optional fields,
// nested relation writes, status-history pushes) and the transactional
// creation flow reads Prisma's nested `{ connect: { id } }` shape directly.
// Rather than force a brittle one-to-one DTO over that complexity, these
// stay intentionally loose — but named/owned here instead of importing
// `Prisma.OrderCreateInput`/`OrderUpdateInput` at the repository boundary.
export type OrderCreateData = Record<string, any>;
export type UpdateOrderData = Record<string, any>;

export interface OrderFilter {
  status?: OrderStatus;
  userId?: number;
  guestPhone?: string;
  guestEmail?: string;
  paymentStatus?: PaymentStatus;
}
