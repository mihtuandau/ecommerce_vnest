"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { BannerForm } from "@/features/banners/components/admin";
import { useCreateBanner } from "@/features/banners/hooks";

export function AdminBannerCreateView() {
  const router = useRouter();
  const { mutate: createBanner, isPending } = useCreateBanner();

  const handleSubmit = (formData: FormData) => {
    createBanner(formData, {
      onSuccess: () => {
        router.push(ROUTES.ADMIN_BANNERS);
      },
    });
  };

  return (
    <div className="space-y-4 pb-10">
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit pl-0 hover:bg-transparent text-slate-400 hover:text-primary gap-1 font-semibold text-xs tracking-wider"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Quay lại danh sách
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Thêm Banner mới
          </h1>
          <p className="text-slate-500 text-sm">
            Tạo hình ảnh quảng bá sản phẩm và chiến dịch mới cho trang chủ.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <BannerForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
}
