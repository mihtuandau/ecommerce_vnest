"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { usersApi } from "@/features/users/api";
import { cartApi } from "@/features/cart/api";
import { useCartStore } from "@/store/useCartStore";
import { sanitizeUser } from "@/utils/sanitizeUser";
interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoading, initAuth, setUser } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // After initAuth, if user is already in store (from localStorage),
  // silently refresh their profile + permissions from the server.
  // This ensures permissions stay in sync even when DB changes (e.g. after re-seed).
  useEffect(() => {
    if (!user) return;

    const refreshPermissions = async () => {
      try {
        const fresh = await usersApi.getProfile();
        if (fresh) {
          setUser(sanitizeUser(fresh) as any);
        }
      } catch {
        // Silently ignore — e.g. if token expired, the axios interceptor handles it
      }
    };

    refreshPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Sync Cart for Logged-in Users
  const { items, setItems, isDirty } = useCartStore();
  const isInitialFetch = useRef(false);
  const prevUserId = useRef<number | null | undefined>(undefined);
  const lastSyncedItems = useRef<string>("");

  useEffect(() => {
    // Only fetch/sync if user state changed (e.g. just logged in)
    if (user?.id === prevUserId.current) return;
    
    const syncAndFetchCart = async () => {
      if (!user) {
        isInitialFetch.current = false;
        prevUserId.current = null;
        lastSyncedItems.current = "";
        return;
      }

      try {
        // 1. If we have local dirty items (from guest session), sync them to server first (Merge)
        if (items.length > 0 && isDirty && !isInitialFetch.current) {
          console.log("[AuthProvider] Merging dirty guest items to server...");
          await cartApi.syncCart(items.map(i => ({ 
            variantId: Number(i.variantId), 
            quantity: i.quantity 
          })));
        }

        // 2. Fetch the combined cart from server
        const cartData = await cartApi.getCart();
        if (cartData && Array.isArray(cartData.cartItems)) {
          const mappedItems = cartData.cartItems.map((item: any) => ({
            productId: String(item.variant?.productId),
            variantId: String(item.variantId),
            name: item.variant?.product?.name || "Sản phẩm",
            price: Number(item.variant?.price || 0),
            discountedPrice: item.discountedPrice ? Number(item.discountedPrice) : undefined,
            originalPrice: (item.variant?.originalPrice || item.variant?.product?.originalPrice) ? Number(item.variant?.originalPrice || item.variant?.product?.originalPrice) : undefined,
            quantity: item.quantity,
            imageUrl: item.variant?.product?.images?.[0]?.url || item.variant?.images?.[0]?.url || "/placeholder.png",
            slug: item.variant?.product?.slug || "",
            color: item.variant?.color,
            size: item.variant?.size,
            selected: true
          }));
          
          // Update ref BEFORE setting state to avoid loop
          lastSyncedItems.current = JSON.stringify(mappedItems.map(i => ({ id: i.variantId, q: i.quantity })));
          setItems(mappedItems, true); // Mark as isFromServer=true
          console.log("[AuthProvider] Cart synced and loaded.");
        }
      } catch (error) {
        console.error("[AuthProvider] Failed to sync/fetch cart:", error);
      } finally {
        isInitialFetch.current = true;
        prevUserId.current = user.id;
      }
    };

    syncAndFetchCart();
  }, [user, setItems, items.length, isDirty]);

  // Ongoing sync for logged-in users
  useEffect(() => {
    if (!user || !isInitialFetch.current) return;

    // Compare current items with last synced items to prevent unnecessary calls
    const currentItemsStr = JSON.stringify(items.map(i => ({ id: i.variantId, q: i.quantity })));
    if (currentItemsStr === lastSyncedItems.current) return;

    const timer = setTimeout(async () => {
      try {
        await cartApi.syncCart(items.map(i => ({ 
          variantId: Number(i.variantId), 
          quantity: i.quantity 
        })));
        lastSyncedItems.current = currentItemsStr;
        console.log("[AuthProvider] Cart background sync completed.");
      } catch (err) {
        console.error("[AuthProvider] Background sync failed:", err);
      }
    }, 2500); // 2.5s debounce

    return () => clearTimeout(timer);
  }, [items, user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
