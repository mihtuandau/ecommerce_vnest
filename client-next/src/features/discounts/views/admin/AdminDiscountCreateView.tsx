"use client";

import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { ROUTES } from "@/constants/routes";
import { DiscountForm } from "@/features/discounts/components/admin";
import { useCreateDiscount } from "@/features/discounts/hooks";

export function AdminDiscountCreateView() {
  const router = useRouter();
  const { mutate: createDiscount, isPending } = useCreateDiscount();

  const handleSubmit = (data: any) => {
    createDiscount(data, {
      onSuccess: () => {
        router.push(ROUTES.ADMIN_DISCOUNTS);
      },
    });
  };

  return (
    <div className="space-y-6 pb-10">
      <AdminPageHeader
        title="Tạo chương trình mới"
        description="Cấu hình mã giảm giá và chiến dịch Flash Sale cho hệ thống."
        eyebrow="Khuyến mãi"
        onBack={() => router.back()}
      />

      <DiscountForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}
