import axios from "axios";
import { env } from "@/config/env";
import { useAuthStore } from "@/store/useAuthStore";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { useAuthStore } = await import("@/store/useAuthStore");
        useAuthStore.getState().setToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch {
        const { useAuthStore } = await import("@/store/useAuthStore");
        useAuthStore.getState().clearAuth();

        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login") &&
          (window.location.pathname.startsWith("/admin") ||
            window.location.pathname.startsWith("/account"))
        ) {
          window.location.href = "/login";
        }
      }
    }

    if (
      error.response?.status === 503 &&
      error.response?.data?.error === "MAINTENANCE_MODE"
    ) {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }

    return Promise.reject(error);
  }
);
