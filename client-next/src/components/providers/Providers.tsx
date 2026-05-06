"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "./AuthProvider";
import { Toaster } from "sonner";
import { AuthSuccessHandler } from "@/components/auth/AuthSuccessHandler";

import { useSyncCart } from "@/features/cart/hooks";

function CartSync() {
  useSyncCart();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartSync />
        {children}
        <Toaster richColors position="top-right" closeButton duration={3000} />
        <AuthSuccessHandler />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
