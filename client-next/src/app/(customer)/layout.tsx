import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/features/chat/components/ChatWidget";
import { SocialProof } from "@/components/marketing/SocialProof";
import { Suspense } from "react";
import { cookies } from "next/headers";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasToken = cookieStore.has("accessToken") || cookieStore.has("access_token");

  return (
    <div className="flex min-h-screen flex-col">
      <div className="no-print sticky top-0 z-50 w-full">
        <Suspense fallback={<div className="h-20 bg-white" />}>
          <Header initialHasToken={hasToken} />
        </Suspense>
      </div>
      <main className="flex-1">{children}</main>
      <div className="no-print">
        <Footer />
      </div>
      <SocialProof />
      <ChatWidget />
    </div>
  );
}
