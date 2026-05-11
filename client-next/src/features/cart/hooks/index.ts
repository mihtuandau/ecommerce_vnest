"use client";

import React from "react";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { cartApi } from "../api";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const storeAddItem = useCartStore((state) => state.addItem);
  const storeRemoveItem = useCartStore((state) => state.removeItem);
  const storeUpdateQuantity = useCartStore((state) => state.updateQuantity);
  const storeClearCart = useCartStore((state) => state.clearCart);
  const setBuyNowItem = useCartStore((state) => state.setBuyNowItem);
  const clearBuyNowItem = useCartStore((state) => state.clearBuyNowItem);
  const storeTotalPrice = useCartStore((state) => state.totalPrice);
  
  const user = useAuthStore((state) => state.user);

  const addItem = React.useCallback(async (item: CartItem) => {
    storeAddItem(item, !user);
    if (user) {
      try {
        await cartApi.addItem(Number(item.variantId), item.quantity);
      } catch (err) {
        console.error("Failed to sync addItem:", err);
      }
    }
  }, [user, storeAddItem]);

  const removeItem = React.useCallback(async (variantId: string) => {
    storeRemoveItem(variantId);
    if (user) {
      try {
        await cartApi.removeItem(Number(variantId));
      } catch (err) {
        console.error("Failed to sync removeItem:", err);
      }
    }
  }, [user, storeRemoveItem]);

  const updateQuantity = React.useCallback(async (variantId: string, quantity: number) => {
    storeUpdateQuantity(variantId, quantity);
    if (user) {
      try {
        if (quantity <= 0) {
          await cartApi.removeItem(Number(variantId));
        } else {
          await cartApi.updateQuantity(Number(variantId), quantity);
        }
      } catch (err) {
        console.error("Failed to sync updateQuantity:", err);
      }
    }
  }, [user, storeUpdateQuantity]);

  const clearCart = React.useCallback(async () => {
    storeClearCart();
    if (user) {
      try {
        await cartApi.clearCart();
      } catch (err) {
        console.error("Failed to sync clearCart:", err);
      }
    }
  }, [user, storeClearCart]);

  const itemCount = React.useMemo(() => 
    items.reduce((sum, item) => sum + item.quantity, 0),
  [items]);

  const totalPrice = React.useMemo(() => storeTotalPrice(), [storeTotalPrice, items]);

  return React.useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setBuyNowItem,
    clearBuyNowItem,
    totalPrice,
    itemCount,
  }), [items, addItem, removeItem, updateQuantity, clearCart, setBuyNowItem, clearBuyNowItem, totalPrice, itemCount]);
}

export function useSyncCart() {
  const { items, setItems, isDirty } = useCartStore();
  const { user } = useAuthStore();
  const [synced, setSynced] = React.useState(false);

  React.useEffect(() => {
    const sync = async () => {
      if (user && !synced) {
        try {
          let result;
          
          if (isDirty && items.length > 0) {
            console.log("[useSyncCart] Dirty cart detected. Merging guest items to server...", items);
            const syncItems = items.map(item => ({
              variantId: Number(item.variantId),
              quantity: item.quantity
            }));
            result = await cartApi.syncCart(syncItems);
          } else {
            console.log("[useSyncCart] Local cart is clean or fresh login. Fetching server state...");
            result = await cartApi.getCart();
          }
          
          if (result && result.cartItems) {
            const mappedItems = result.cartItems.map((item: {
              variantId: number;
              quantity: number;
              discountedPrice?: number;
              variant: {
                id: number;
                productId: string;
                price: number;
                originalPrice?: number | null;
                color?: string;
                size?: string;
                images?: { url: string }[];
                product: {
                  name: string;
                  slug: string;
                  originalPrice?: number | null;
                  images?: { url: string }[];
                }
              }
            }) => ({
              productId: item.variant.productId,
              variantId: String(item.variantId),
              name: item.variant.product.name,
              price: Number(item.variant.price),
              discountedPrice: item.discountedPrice ? Number(item.discountedPrice) : undefined,
              originalPrice: (item.variant.originalPrice || item.variant.product.originalPrice) ? Number(item.variant.originalPrice || item.variant.product.originalPrice) : undefined,
              quantity: item.quantity,
              imageUrl: item.variant.images?.[0]?.url || item.variant.product.images?.[0]?.url,
              slug: item.variant.product.slug,
              color: item.variant.color,
              size: item.variant.size,
              selected: true
            }));
            
            setItems(mappedItems, true);
          }
          setSynced(true);
        } catch (error) {
          console.error("[useSyncCart] Failed to sync cart:", error);
        }
      }
    };

    sync();
  }, [user, synced, isDirty]);

  React.useEffect(() => {
    if (!user) {
      setSynced(false);
    }
  }, [user]);

  return { synced };
}
