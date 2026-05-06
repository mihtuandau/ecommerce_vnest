import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/features/chat/components/ChatWidget";
import { SocialProof } from "@/components/marketing/SocialProof";
import { Suspense } from "react";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="no-print sticky top-0 z-50 w-full">
        <Suspense fallback={<div className="h-20 bg-white" />}>
          <Header />
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
