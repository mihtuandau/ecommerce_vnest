"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tạo chương trình mới
          </h1>
          <p className="text-slate-500 text-sm">
            Cấu hình mã giảm giá và chiến dịch Flash Sale cho hệ thống.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <DiscountForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
}
