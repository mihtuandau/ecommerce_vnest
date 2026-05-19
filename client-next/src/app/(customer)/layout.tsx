import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/features/chat/components/ChatWidget";
import { SocialProof } from "@/components/marketing/SocialProof";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { Skeleton } from "@/components/ui/Skeleton";
import { Wrench, Phone, Mail, Clock } from "lucide-react";
import { env } from "@/config/env";
import { Role } from "@/types/enums";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasToken = cookieStore.has("accessToken");
  const token = cookieStore.get("accessToken")?.value;

  let settings = null;
  let isMaintenance = false;
  let isAdmin = false;

  // 1. Fetch system settings on the server side (cached for fast response)
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/system-settings`, {
      next: { revalidate: 15 }, // Cache settings for 15 seconds to avoid overloading disk I/O
    });
    if (res.ok) {
      settings = await res.json();
      isMaintenance = !!settings?.maintenanceMode;
    }
  } catch (err) {
    console.error("Failed to fetch system settings on server side:", err);
  }

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
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F4] text-[#3D2B1A] p-6 font-sans-brand min-h-screen">
        {/* Luxury abstract background ambient highlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#C4783A]/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#8A7966]/5 blur-3xl" />

        <div className="max-w-md w-full text-center space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-700">
          {/* Logo / Brand name */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-[0.15em] text-[#3D2B1A] uppercase">
              {settings?.storeName || "LUXE E-Commerce"}
            </h2>
            <div className="h-[1px] w-12 bg-[#C4783A]/40 mx-auto rounded-full" />
          </div>

          {/* Maintenance Icon Card */}
          <div className="relative mx-auto w-24 h-24 bg-white rounded-3xl border border-[#DDD6C8] flex items-center justify-center shadow-xs">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#C4783A]/5 to-[#8A7966]/5 rounded-3xl" />
            <Wrench className="h-9 w-9 text-[#C4783A] animate-bounce duration-1000" />
          </div>

          {/* Messages */}
          <div className="space-y-3 px-2">
            <h1 className="text-[22px] font-bold text-[#3D2B1A] tracking-tight">
              Hệ thống đang bảo trì
            </h1>
            <p className="text-[13.5px] text-[#8A7966] leading-relaxed font-medium">
              Chúng tôi đang tiến hành bảo dưỡng định kỳ hệ thống của cửa hàng để mang
              lại chất lượng phục vụ và trải nghiệm mua sắm hoàn mỹ nhất cho quý khách.
            </p>
          </div>

          {/* Expected time card */}
          <div className="p-4 bg-[#F9F6F0] rounded-2xl border border-[#EFEBE4] flex items-center gap-3.5 text-left max-w-sm mx-auto shadow-2xs">
            <Clock className="h-5 w-5 text-[#C4783A] shrink-0" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#3D2B1A]">
                Thời gian dự kiến hoàn thành
              </p>
              <p className="text-[11px] text-[#8A7966] leading-relaxed font-semibold">
                Thường mất khoảng 1 - 2 tiếng. Xin trân trọng cảm ơn sự kiên nhẫn của
                quý khách hàng!
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="pt-5 space-y-3.5 border-t border-[#DDD6C8] max-w-sm mx-auto">
            <p className="text-[10px] font-bold text-[#8A7966] uppercase tracking-[0.12em]">
              Hỗ trợ trực tuyến
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 text-xs font-semibold text-[#3D2B1A]">
              {settings?.storePhone && (
                <a
                  href={`tel:${settings.storePhone}`}
                  className="flex items-center justify-center gap-2 text-[#3D2B1A] hover:text-[#C4783A] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-[#C4783A]" /> {settings.storePhone}
                </a>
              )}
              {settings?.storeEmail && (
                <a
                  href={`mailto:${settings.storeEmail}`}
                  className="flex items-center justify-center gap-2 text-[#3D2B1A] hover:text-[#C4783A] transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-[#C4783A]" /> {settings.storeEmail}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Normal flow if not under maintenance or user is admin
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense
        fallback={
          <div className="flex flex-col w-full">
            {/* TOP ANNOUNCEMENT BAR SKELETON */}
            <div className="bg-primary h-[38px] w-full hidden lg:block" />

            <div className="w-full bg-white border-b border-brand-sand h-16 lg:h-[108px] fixed top-0 left-0 z-50">
              {/* Top Bar Skeleton inside fixed header */}
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
        <Header initialHasToken={hasToken} />
      </Suspense>
      <main className="flex-1">{children}</main>
      <div className="no-print">
        <Footer />
      </div>
      <SocialProof />
      <ChatWidget />
    </div>
  );
}
