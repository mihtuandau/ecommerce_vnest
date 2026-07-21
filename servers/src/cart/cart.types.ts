import { CartItem } from '@prisma/client';

// Domain-facing alias — callers import this instead of reaching into
// '@prisma/client' directly, so the repository stays the single seam
// that's aware of Prisma's generated shape.
export type CartItemEntity = CartItem;

export interface CreateCartItemData {
  cartId: number;
  variantId: number;
  quantity: number;
}
