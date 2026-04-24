import { api } from "@/lib/axios";
import type { LoginPayload, RegisterPayload, AuthResponse } from "./types";

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },

  forgotPassword: async (email: string) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },

  resetPassword: async (token: string, email: string, password: string) => {
    const { data } = await api.post("/auth/reset-password", {
      token,
      email,
      password,
    });
    return data;
  },

  verifyOTP: async (email: string, otp: string) => {
    const { data } = await api.post("/auth/verify-otp", { email, otp });
    return data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });
    return data;
  },
};
