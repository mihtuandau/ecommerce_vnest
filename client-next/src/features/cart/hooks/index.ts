"use client";

import { useCartStore } from "@/store/useCartStore";

export function useCart() {
  const { items, addItem, removeItem, updateQuantity, clearCart, totalPrice } =
    useCartStore();

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice: totalPrice(),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export function useSyncCart() {
  // TODO: Sync local cart with server when user logs in
}
