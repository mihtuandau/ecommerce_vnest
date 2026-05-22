"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
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

  // Sau khi init, luôn thử hydrate profile từ server bằng httpOnly cookie.
  // Quan trọng cho Google OAuth: backend redirect chỉ set cookie, frontend store
  // chưa có user nên vẫn cần gọi profile để lấy name/avatar/permissions.
  useEffect(() => {
    const refreshProfile = async () => {
      try {
        const fresh = await usersApi.getProfile();
        if (fresh) {
          setUser(sanitizeUser(fresh) as any);
        }
      } catch {
        // Silently ignore — e.g. if token expired, the axios interceptor handles it
      }
    };

    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
