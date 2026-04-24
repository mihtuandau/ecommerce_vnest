"use client";

import React, { useState } from "react";
import { useUserDetail, useUpdateUser } from "@/features/users/hooks";
import { UserForm } from "@/features/users/components/admin/UserForm";
import { useParams, useRouter } from "next/navigation";
import { CustomerCard } from "@/features/users/components/admin/detail/CustomerCard";
import { Actions } from "@/features/users/components/admin/detail/Actions";
import { CustomerStats } from "@/features/users/components/admin/detail/CustomerStats";
import { CustomerOrders } from "@/features/users/components/admin/detail/CustomerOrders";
import { CustomerTabs } from "@/features/users/components/admin/detail/CustomerTabs";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminUserDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: user, isLoading } = useUserDetail(id);
  const { mutate: updateUser, isPending } = useUpdateUser();
  const [activeTab, setActiveTab] = useState("orders");

  const handleSubmit = (data: any) => {
    updateUser({ id, data });
  };

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="text-sm font-bold text-slate-400">Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (!user) return <div className="p-20 text-center font-bold text-slate-500">Không tìm thấy người dùng</div>;

  const customer = user as any;
  const orders = customer.orders || [];
  const totalSpent = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
  const totalReviews = customer.reviews?.length || 0;
  const lastOrderDate = orders.length > 0 ? orders[0].createdAt : undefined;

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-lg border border-slate-200 text-slate-400 hover:text-primary"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hồ sơ khách hàng</h1>
            
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar (Left) */}
        <div className="space-y-6">
          <CustomerCard user={user} />
          <Actions user={user} onEdit={() => setActiveTab("settings")} />
        </div>

        {/* Main Content (Right) */}
        <div className="lg:col-span-2 space-y-6">
          <CustomerStats 
            totalSpent={totalSpent}
            totalOrders={orders.length}
            totalReviews={totalReviews}
            lastOrderDate={lastOrderDate}
          />

          <CustomerTabs 
            user={user}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onUpdate={handleSubmit}
            isUpdating={isPending}
          />
        </div>
      </div>
    </div>
  );
}
