import { Header } from "@/components/layout/Header";
import { CustomerFooter } from "@/components/layout/CustomerFooter";
import { MaintenanceShield } from "@/components/layout/MaintenanceShield";
import { CustomerChatWidget } from "@/components/layout/CustomerChatWidget";
import { CustomerSocialProof } from "@/components/layout/CustomerSocialProof";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { Skeleton } from "@/components/ui/Skeleton";
import { env } from "@/config/env";
import { Role } from "@/types/enums";
import type { SystemSettings } from "@/features/settings/types";
import type { Category } from "@/types/models";

async function getSystemSettings(): Promise<SystemSettings | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  const apiUrl = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

  try {
    const res = await fetch(`${apiUrl}/system-settings`, {
      next: { revalidate: 15 },
      signal: controller.signal,
    });

    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    if (process.env.NODE_ENV === "production") {
      console.warn("System settings unavailable; continuing without maintenance mode.");
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function getNavigationCategories(): Promise<Category[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  const apiUrl = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

  try {
    const res = await fetch(`${apiUrl}/categories?tree=true`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : data?.data || [];
  } catch (err) {
    if (process.env.NODE_ENV === "production") {
      console.warn("Navigation categories unavailable; continuing with fallback nav.");
    }
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasToken = cookieStore.has("accessToken");
  const token = cookieStore.get("accessToken")?.value;

  let settings: SystemSettings | null = null;
  let categories: Category[] = [];
  let isMaintenance = false;
  let isAdmin = false;

  // 1. Fetch system settings on the server side (cached for fast response)
  [settings, categories] = await Promise.all([
    getSystemSettings(),
    getNavigationCategories(),
  ]);
  isMaintenance = !!settings?.maintenanceMode;

  // 2. Check if the logged-in user is an admin by decoding JWT payload
  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
      const decoded = JSON.parse(decodedJson);
      isAdmin =
        decoded?.role === Role.ADMIN ||
        decoded?.role === Role.KHO ||
        decoded?.role === Role.BAN_HANG;
    } catch {}
  }

  // 3. If maintenance mode is active and user is not an admin, return the Maintenance UI instantly
  if (isMaintenance && !isAdmin) {
    return <MaintenanceShield settings={settings} />;
  }

  // 4. Normal flow if not under maintenance or user is admin
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense
        fallback={
          <div className="flex flex-col w-full">
            
            <div className="bg-primary h-[38px] w-full hidden lg:block" />

            <div className="w-full bg-white border-b border-brand-sand h-16 lg:h-[108px] fixed top-0 left-0 z-50">
              
              <div className="bg-primary h-[38px] w-full hidden lg:block" />

              <div className="h-16 flex items-center max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <Skeleton className="w-40 h-8 rounded-md" />
                <div className="flex-1 max-w-xl mx-auto h-10 hidden lg:block px-8">
                  <Skeleton className="w-full h-full rounded-full" />
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 lg:w-24 rounded-full" />
                </div>
              </div>
              <div className="h-11 border-t border-brand-sand/30 hidden lg:flex items-center justify-center gap-6">
                <Skeleton className="w-20 h-4 rounded-md" />
                <Skeleton className="w-20 h-4 rounded-md" />
                <Skeleton className="w-20 h-4 rounded-md" />
                <Skeleton className="w-20 h-4 rounded-md" />
              </div>
            </div>
            <div className="h-[64px] lg:h-[146px] w-full" />
          </div>
        }
      >
        <Header
          initialHasToken={hasToken}
          initialSettings={settings}
          initialCategories={categories}
        />
      </Suspense>
      <main className="flex-1">{children}</main>
      <div className="no-print">
        <CustomerFooter initialSettings={settings} />
      </div>
      <CustomerSocialProof />
      <CustomerChatWidget />
    </div>
  );
}
