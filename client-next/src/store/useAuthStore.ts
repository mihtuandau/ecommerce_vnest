import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/models";
import Cookies from "js-cookie";

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;

  setUser: (user: User) => void;
  setToken: (accessToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: true,

      setUser: (user) => set({ user }),
      setToken: (accessToken) => {
        set({ accessToken });
        Cookies.set("accessToken", accessToken, { expires: 7, path: "/" });
      },
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
        if (accessToken) Cookies.set("accessToken", accessToken, { expires: 7, path: "/" });
      },
      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        });
        // Remove cookie with explicit path and sameSite
        Cookies.remove("accessToken", { path: "/" });
      },
      logout: async () => {
        try {
          const { authApi } = await import("@/features/auth/api");
          await authApi.logout();
        } catch (error) {
          console.error("Logout API error:", error);
        } finally {
          get().clearAuth();
          // Optional: clear entire storage if needed
          localStorage.removeItem("vnest-auth");
          window.location.href = "/login";
        }
      },
      initAuth: () => {
        // Sync cookies to store if needed
        const accessToken = Cookies.get("accessToken") || null;
        const refreshToken = Cookies.get("refreshToken") || null;
        set({ accessToken, refreshToken, isLoading: false });
      },
    }),
    {
      name: "vnest-auth",
      // Only persist user profile for UI — tokens are managed via httpOnly cookies set by the backend
      partialize: (state) => ({
        // Only store UI-needed fields — strip internal backend fields
        user: state.user ? {
          id: state.user.id,
          name: state.user.name,
          email: state.user.email,
          phone: (state.user as any).phone,
          avatar: (state.user as any).avatar,
          role: state.user.role,
          permissions: (state.user as any).permissions,
        } : null,
      }),
    }
  )
);
