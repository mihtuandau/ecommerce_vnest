"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { AdminTopBar } from "@/components/layout/AdminTopBar";
import { useAuthStore } from "@/store/useAuthStore";
import { Skeleton } from "@/components/ui/Skeleton";

import { FullPageLoading } from "@/components/ui/Spinner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();

  // Prevent flash of unauthorized content
  if (isLoading || !user) {
    return <FullPageLoading />;
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <div className="no-print">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="no-print">
          <AdminTopBar />
        </div>
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
