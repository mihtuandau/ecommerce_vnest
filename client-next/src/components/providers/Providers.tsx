"use client";

import dynamic from "next/dynamic";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "./AuthProvider";
import { Toaster } from "sonner";

const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () =>
          import("@tanstack/react-query-devtools").then(
            (mod) => mod.ReactQueryDevtools
          ),
        { ssr: false }
      )
    : null;

const CartSync = dynamic(
  () => import("./CartSync").then((mod) => mod.CartSync),
  { ssr: false }
);

const AuthSuccessHandler = dynamic(
  () =>
    import("@/features/auth/components/shared/AuthSuccessHandler").then(
      (mod) => mod.AuthSuccessHandler
    ),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartSync />
        {children}
        <Toaster richColors position="top-right" closeButton duration={3000} />
        <AuthSuccessHandler />
      </AuthProvider>
      {ReactQueryDevtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
