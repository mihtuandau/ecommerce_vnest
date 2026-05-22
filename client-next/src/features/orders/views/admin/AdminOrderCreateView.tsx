"use client";

import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { AdminOrderForm } from "@/features/orders/components/admin/create/OrderForm";

export function AdminOrderCreateView() {
  const router = useRouter();

  return (
    <div className="space-y-6 pb-4">
      <AdminPageHeader
        title="Tạo đơn mới"
        description="Tạo đơn hàng thủ công cho khách hàng hoặc đơn phát sinh tại cửa hàng."
        eyebrow="Đơn hàng"
        onBack={() => router.back()}
      />

      <AdminOrderForm />
    </div>
  );
}
