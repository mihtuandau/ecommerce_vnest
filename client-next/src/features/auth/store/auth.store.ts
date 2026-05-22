import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/models";

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;

  setUser: (user: User) => void;
  setToken: (accessToken: string) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: true,

      setUser: (user) => set({ user }),
      setToken: (accessToken) => set({ accessToken }),
      setTokens: (accessToken, _refreshToken) => {
        set({ accessToken });
      },
      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
        });
      },
      logout: async () => {
        try {
          const { authApi } = await import("@/features/auth/api/auth.api");
          await authApi.logout();
        } catch (error) {
          console.error("Logout API error:", error);
        } finally {
          get().clearAuth();
          // Optional: clear entire storage if needed
          localStorage.removeItem("minhtuan-auth");
          window.location.href = "/login";
        }
      },
      initAuth: () => {
        set({ isLoading: false });
      },
    }),
    {
      name: "minhtuan-auth",
      // Only persist user profile for UI — tokens are managed via httpOnly cookies set by the backend
      partialize: (state) => ({
        // Only store UI-needed fields — strip internal backend fields
        user: state.user
          ? {
              id: state.user.id,
              name: state.user.name,
              email: state.user.email,
              phone: state.user.phone,
              avatar: state.user.avatar,
              role: state.user.role,
              permissions: state.user.permissions,
            }
          : null,
      }),
    }
  )
);
