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
  const setItems = useCartStore((state) => state.setItems);
  const isInitialFetch = useRef(false);

  useEffect(() => {
    if (!user) {
      isInitialFetch.current = false;
      return;
    }

    const fetchCart = async () => {
      try {
        const cartData = await cartApi.getCart();
        if (cartData && Array.isArray(cartData.cartItems)) {
          // Map backend items to frontend CartItem interface
          const mappedItems = cartData.cartItems.map((item: any) => ({
            productId: String(item.variant?.productId),
            variantId: String(item.variantId),
            name: item.variant?.product?.name || "Sản phẩm",
            price: item.variant?.price || 0,
            quantity: item.quantity,
            imageUrl: item.variant?.product?.images?.[0]?.url || "/placeholder.png",
            slug: item.variant?.product?.slug || "",
            color: item.variant?.color,
            size: item.variant?.size,
          }));
          setItems(mappedItems);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        isInitialFetch.current = true;
      }
    };

    fetchCart();
  }, [user, setItems]);

  // Automatically sync cart to server when items change (for logged-in users)
  const items = useCartStore((state) => state.items);
  useEffect(() => {
    // Only sync if we have a user and we've already performed the initial fetch
    // (to avoid wiping the cart with [] before the DB data arrives)
    if (!user || !isInitialFetch.current) return;

    const timer = setTimeout(() => {
      cartApi.syncCart(items.map(i => ({ 
        variantId: Number(i.variantId), 
        quantity: i.quantity 
      })));
    }, 1500); // Debounce 1.5s

    return () => clearTimeout(timer);
  }, [items, user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
