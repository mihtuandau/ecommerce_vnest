"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AccountSidebar } from "@/components/layout/AccountSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { AccountSkeleton } from "@/features/users/components/customer/AccountSkeleton";
import { AddressTab } from "@/features/users/components/customer/account/AddressTab";
import { NotificationsTab } from "@/features/users/components/customer/account/NotificationsTab";
import { ProfileTab } from "@/features/users/components/customer/account/ProfileTab";
import { ReviewsTab } from "@/features/users/components/customer/account/ReviewsTab";
import { SecurityTab } from "@/features/users/components/customer/account/SecurityTab";

type Tab = "info" | "address" | "security" | "notifications" | "reviews";

const tabLabels: Record<Tab, string> = {
  info: "Hồ sơ",
  address: "Địa chỉ",
  security: "Bảo mật",
  notifications: "Thông báo",
  reviews: "Đánh giá",
};

export function AccountView() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("info");

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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <Breadcrumb>
          <BreadcrumbList className="text-[13px] font-medium">
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
              <BreadcrumbPage>{tabLabels[activeTab]}</BreadcrumbPage>
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
