"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { AccountSidebar } from "@/components/layout/AccountSidebar";
import { useSearchParams } from "next/navigation";
import { ProfileTab } from "./account/ProfileTab";
import { AddressTab } from "./account/AddressTab";
import { SecurityTab } from "./account/SecurityTab";
import { NotificationsTab } from "./account/NotificationsTab";
import { ReviewsTab } from "./account/ReviewsTab";
import { AccountSkeleton } from "./AccountSkeleton";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui";

type Tab = "info" | "address" | "security" | "notifications" | "reviews";

export function AccountView() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("info");

  // Sync activeTab with URL query param
  useEffect(() => {
    const tab = searchParams.get("tab") as Tab;
    if (
      tab &&
      ["info", "address", "security", "notifications", "reviews"].includes(tab)
    ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return <AccountSkeleton />;

  return (
    <div className="bg-brand-cream min-h-screen pb-24 font-sans-brand">
      {/* ── BREADCRUMBS ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Trang chủ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tài khoản</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {activeTab === "info"
                  ? "Hồ sơ"
                  : activeTab === "address"
                    ? "Địa chỉ"
                    : activeTab === "security"
                      ? "Bảo mật"
                      : activeTab === "notifications"
                        ? "Thông báo"
                        : "Đánh giá"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:grid lg:grid-cols-[256px_1fr] gap-8 items-start">
          <AccountSidebar />

          <main className="flex-1 w-full">
            {activeTab === "info" && <ProfileTab user={user} />}
            {activeTab === "address" && <AddressTab />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "reviews" && <ReviewsTab />}
          </main>
        </div>
      </div>
    </div>
  );
}
