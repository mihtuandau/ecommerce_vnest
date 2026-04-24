"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { usersApi } from "@/features/users/api";
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

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
