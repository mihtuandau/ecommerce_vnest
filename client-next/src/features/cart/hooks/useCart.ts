"use client";

import React from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cartApi } from "@/features/cart/api";
import { calculateCartItemCount } from "@/features/cart/services";
import { type CartItem, useCartStore } from "@/features/cart/store/cart.store";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const storeAddItem = useCartStore((state) => state.addItem);
  const storeRemoveItem = useCartStore((state) => state.removeItem);
  const storeUpdateQuantity = useCartStore((state) => state.updateQuantity);
  const storeClearCart = useCartStore((state) => state.clearCart);
  const storeClearSelectedItems = useCartStore((state) => state.clearSelectedItems);
  const setBuyNowItem = useCartStore((state) => state.setBuyNowItem);
  const clearBuyNowItem = useCartStore((state) => state.clearBuyNowItem);
  const storeTotalPrice = useCartStore((state) => state.totalPrice);
  const user = useAuthStore((state) => state.user);

  const addItem = React.useCallback(
    async (item: CartItem) => {
      storeAddItem(item, !user);
      if (!user) return;

      try {
        await cartApi.addItem(Number(item.variantId), item.quantity);
      } catch (err) {
        console.error("Failed to sync addItem:", err);
      }
    },
    [user, storeAddItem]
  );

  const removeItem = React.useCallback(
    async (variantId: string) => {
      storeRemoveItem(variantId);
      if (!user) return;

      try {
        await cartApi.removeItem(Number(variantId));
      } catch (err) {
        console.error("Failed to sync removeItem:", err);
      }
    },
    [user, storeRemoveItem]
  );

  const updateQuantity = React.useCallback(
    async (variantId: string, quantity: number) => {
      storeUpdateQuantity(variantId, quantity);
      if (!user) return;

      try {
        if (quantity <= 0) {
          await cartApi.removeItem(Number(variantId));
        } else {
          await cartApi.updateQuantity(Number(variantId), quantity);
        }
      } catch (err) {
        console.error("Failed to sync updateQuantity:", err);
      }
    },
    [user, storeUpdateQuantity]
  );

  const clearCart = React.useCallback(async () => {
    storeClearCart();
    if (!user) return;

    try {
      await cartApi.clearCart();
    } catch (err) {
      console.error("Failed to sync clearCart:", err);
    }
  }, [user, storeClearCart]);

  const clearSelectedItems = React.useCallback(async () => {
    const currentItems = useCartStore.getState().items;
    storeClearSelectedItems();
    if (!user) return;

    try {
      const selectedItems = currentItems.filter((item) => item.selected);
      await Promise.all(
        selectedItems.map((item) => cartApi.removeItem(Number(item.variantId)))
      );
    } catch (err) {
      console.error("Failed to sync clearSelectedItems:", err);
    }
  }, [user, storeClearSelectedItems]);

  const itemCount = React.useMemo(() => calculateCartItemCount(items), [items]);

  const totalPrice = React.useMemo(() => storeTotalPrice(), [storeTotalPrice, items]);

  return React.useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      clearSelectedItems,
      setBuyNowItem,
      clearBuyNowItem,
      totalPrice,
      itemCount,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      clearSelectedItems,
      setBuyNowItem,
      clearBuyNowItem,
      totalPrice,
      itemCount,
    ]
  );
}
