"use client";

import React from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cartApi } from "@/features/cart/api";
import { mapServerCartToCartItems } from "@/features/cart/services";
import { useCartStore } from "@/features/cart/store/cart.store";

export function useSyncCart() {
  const { items, setItems, isDirty } = useCartStore();
  const { user } = useAuthStore();
  const [synced, setSynced] = React.useState(false);

  React.useEffect(() => {
    const sync = async () => {
      if (!user || synced) return;

      try {
        const result =
          isDirty && items.length > 0
            ? await cartApi.syncCart(
                items.map((item) => ({
                  variantId: Number(item.variantId),
                  quantity: item.quantity,
                }))
              )
            : await cartApi.getCart();

        if (result?.cartItems) {
          setItems(mapServerCartToCartItems(result), true);
        }

        setSynced(true);
      } catch (error) {
        console.error("[useSyncCart] Failed to sync cart:", error);
      }
    };

    sync();
  }, [user, synced, isDirty, items, setItems]);

  React.useEffect(() => {
    if (!user) setSynced(false);
  }, [user]);

  return { synced };
}
