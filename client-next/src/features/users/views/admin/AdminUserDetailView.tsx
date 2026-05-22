"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { adminUI } from "@/constants/admin-ui";
import { Actions } from "@/features/users/components/admin/detail/Actions";
import { CustomerCard } from "@/features/users/components/admin/detail/CustomerCard";
import { CustomerStats } from "@/features/users/components/admin/detail/CustomerStats";
import { CustomerTabs } from "@/features/users/components/admin/detail/CustomerTabs";
import { useUpdateUser, useUserDetail } from "@/features/users/hooks";
import { OrderStatus, PaymentStatus } from "@/types/enums";

export function AdminUserDetailView() {
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
        <Spinner size="lg" />
        <p className="text-sm font-medium text-slate-400">Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-20 text-center text-sm font-medium text-slate-500">
        Không tìm thấy người dùng
      </div>
    );
  }

  const customer = user as any;
  const orders = customer.orders || [];
  const consumptionOrders = orders.filter((order: any) => {
    const isDelivered = order.status === OrderStatus.DELIVERED;
    const isPaid =
      order.payment?.status === PaymentStatus.SUCCESS ||
      order.payment?.status === "PAID";
    return isDelivered && isPaid;
  });

  const totalSpent = consumptionOrders.reduce(
    (sum: number, order: any) => sum + (order.total || 0),
    0
  );
  const totalOrders = consumptionOrders.length;
  const totalReviews = customer.reviews?.length || 0;
  const lastOrderDate = orders[0]?.createdAt;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg border border-slate-200 text-slate-400 hover:text-teal-700 hover:bg-teal-50"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className={adminUI.typography.heading}>Hồ sơ khách hàng</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <CustomerCard user={user} />
          <Actions user={user} onEdit={() => setActiveTab("settings")} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <CustomerStats
            totalSpent={totalSpent}
            totalOrders={totalOrders}
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
