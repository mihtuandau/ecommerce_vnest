import { create } from "zustand";
import type { User } from "@/types/models";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthSlice = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (accessToken) => set({ accessToken }),
  clearAuth: () => set({ user: null, accessToken: null }),
}));
