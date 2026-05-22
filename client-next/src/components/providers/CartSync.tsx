"use client";

import { useSyncCart } from "@/features/cart/hooks/useSyncCart";

export function CartSync() {
  useSyncCart();
  return null;
}
