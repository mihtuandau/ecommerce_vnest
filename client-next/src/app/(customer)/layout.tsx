import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/features/chat/components/ChatWidget";
import { SocialProof } from "@/components/marketing/SocialProof";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { Skeleton } from "@/components/ui/Skeleton";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasToken = cookieStore.has("accessToken") ;

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={
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
      }>
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
