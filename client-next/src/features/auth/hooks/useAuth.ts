"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import { useCartStore } from "@/store/useCartStore";
import { authApi } from "../api/auth.api";
import type { LoginPayload, RegisterPayload } from "../types/auth.types";
import { sanitizeUser } from "@/utils/sanitizeUser";

export function useAuth() {
  const { setUser, setTokens, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      if (data.accessToken) {
        setTokens(data.accessToken, data.refreshToken);
        setUser(sanitizeUser(data.user) as any);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
  });

  const verify2FALoginMutation = useMutation({
    mutationFn: (data: { email: string; code: string }) =>
      authApi.verify2FALogin(data.email, data.code),
    onSuccess: (data) => {
      if (data.accessToken) {
        setTokens(data.accessToken, data.refreshToken);
        setUser(sanitizeUser(data.user) as any);
      }
    },
  });

  const logout = async () => {
    try {
      // Clear httpOnly cookies on the backend (access_token + refresh_token)
      await authApi.logout();
    } catch {
      // Ignore errors — always clear local state regardless
    } finally {
      clearAuth();
      useCartStore.getState().clearCart();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    verify2FALogin: verify2FALoginMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending || verify2FALoginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
