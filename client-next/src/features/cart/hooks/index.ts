"use client";

import { useCartStore, CartItem } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { cartApi } from "../api";

export function useCart() {
  const { 
    items, 
    addItem: storeAddItem, 
    removeItem: storeRemoveItem, 
    updateQuantity: storeUpdateQuantity, 
    clearCart: storeClearCart, 
    setBuyNowItem,
    clearBuyNowItem,
    totalPrice 
  } = useCartStore();
  const { user } = useAuthStore();

  const addItem = async (item: CartItem) => {
    storeAddItem(item, !user);
    if (user) {
      try {
        await cartApi.addItem(Number(item.variantId), item.quantity);
      } catch (err) {
        console.error("Failed to sync addItem:", err);
      }
    }
  };

  const removeItem = async (variantId: string) => {
    storeRemoveItem(variantId);
    if (user) {
      try {
        await cartApi.removeItem(Number(variantId));
      } catch (err) {
        console.error("Failed to sync removeItem:", err);
      }
    }
  };

  const updateQuantity = async (variantId: string, quantity: number) => {
    storeUpdateQuantity(variantId, quantity);
    if (user) {
      try {
        await cartApi.updateQuantity(Number(variantId), quantity);
      } catch (err) {
        console.error("Failed to sync updateQuantity:", err);
      }
    }
  };

  const clearCart = async () => {
    storeClearCart();
    if (user) {
      try {
        await cartApi.clearCart();
      } catch (err) {
        console.error("Failed to sync clearCart:", err);
      }
    }
  };

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setBuyNowItem,
    clearBuyNowItem,
    totalPrice: totalPrice(),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export function useSyncCart() {
  const { items, setItems, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [synced, setSynced] = React.useState(false);

  React.useEffect(() => {
    const sync = async () => {
      if (isAuthenticated && user && items.length > 0 && !synced) {
        try {
          console.log("[useSyncCart] Syncing local items to server...", items);
          const syncItems = items.map(item => ({
            variantId: Number(item.variantId),
            quantity: item.quantity
          }));
          
          const result = await cartApi.syncCart(syncItems);
          
          if (result && result.cartItems) {
            const mappedItems = result.cartItems.map((item: any) => ({
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
            
            setItems(mappedItems);
            console.log("[useSyncCart] Sync completed and store updated.");
          }
          setSynced(true);
        } catch (error) {
          console.error("[useSyncCart] Failed to sync cart:", error);
        }
      }
    };

    sync();
  }, [isAuthenticated, user, synced]);

  return { synced };
}
