"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { AdminTopBar } from "@/components/layout/AdminTopBar";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { FullPageLoading } from "@/components/ui/Spinner";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();

  // Prevent flash of unauthorized content
  if (isLoading || !user) {
    return <FullPageLoading />;
  }

  return (
    <div className="admin-theme flex min-h-screen">
      
      <div className="no-print h-screen sticky top-0 z-50">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        
        <div className="no-print sticky top-0 z-40 bg-white/80 backdrop-blur-md">
          <AdminTopBar />
        </div>

        
        <main className="flex-1 p-8">
          <div className="max-w-[1440px] mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
