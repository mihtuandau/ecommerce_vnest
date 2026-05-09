"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { DiscountForm } from "@/features/discounts/components/admin/DiscountForm";
import { useDiscountDetail, useUpdateDiscount } from "@/features/discounts/hooks";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants/routes";

export default function EditDiscountPage() {
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
        <p className="text-sm font-bold text-slate-400">Đang tải thông tin mã...</p>
      </div>
    );
  }

  if (!discount) {
    return (
      <div className="p-20 text-center font-bold text-slate-500">
        Không tìm thấy mã giảm giá
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10 mx-auto">
      <div className="flex flex-col gap-1">
        <Button 
          variant="ghost" 
          size="sm"
          className="w-fit pl-0 hover:bg-transparent text-slate-400 hover:text-primary gap-1 font-bold text-xs uppercase tracking-wider"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Quay lại danh sách
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Chi tiết chương trình</h1>
            <p className="text-slate-500 text-sm">
              Cập nhật cấu hình và thời gian áp dụng mã giảm giá.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <DiscountForm initialData={discount} onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
}
