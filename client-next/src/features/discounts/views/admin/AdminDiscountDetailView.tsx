"use client";

import { useParams, useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants/routes";
import { DiscountForm } from "@/features/discounts/components/admin";
import { useDiscountDetail, useUpdateDiscount } from "@/features/discounts/hooks";

export function AdminDiscountDetailView() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: discount, isLoading } = useDiscountDetail(id);
  const { mutate: updateDiscount, isPending } = useUpdateDiscount();

  const handleSubmit = (data: any) => {
    updateDiscount(
      { id, data },
      {
        onSuccess: () => {
          router.push(ROUTES.ADMIN_DISCOUNTS);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-slate-400">
          Đang tải thông tin mã...
        </p>
      </div>
    );
  }

  if (!discount) {
    return (
      <div className="p-20 text-center text-sm font-medium text-slate-500">
        Không tìm thấy mã giảm giá
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <AdminPageHeader
        title="Chi tiết chương trình"
        description="Cập nhật cấu hình và thời gian áp dụng mã giảm giá."
        eyebrow="Khuyến mãi"
        onBack={() => router.back()}
      />

      <DiscountForm
        initialData={discount}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </div>
  );
}
