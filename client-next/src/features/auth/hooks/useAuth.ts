"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "../api";
import type { LoginPayload, RegisterPayload } from "../types";
import { sanitizeUser } from "@/utils/sanitizeUser";

export function useAuth() {
  const { setUser, setTokens, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(sanitizeUser(data.user) as any);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
  });

  const logout = async () => {
    try {
      // Clear httpOnly cookies on the backend (access_token + refresh_token)
      await authApi.logout();
    } catch {
      // Ignore errors — always clear local state regardless
    } finally {
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
