"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { BannerForm } from "@/features/banners/components/admin/BannerForm";
import { useBannerDetail, useUpdateBanner } from "@/features/banners/hooks";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";



export default function EditBannerPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: banner, isLoading } = useBannerDetail(id);
  const { mutate: updateBanner, isPending } = useUpdateBanner();

  const handleSubmit = (formData: FormData) => {
    updateBanner(
      { id, formData },
      {
        onSuccess: () => {
          router.push(ROUTES.ADMIN_BANNERS);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-slate-200" />
          <ChevronLeft className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Đang tải dữ liệu Banner...</p>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <p className="text-slate-500 font-bold">Không tìm thấy Banner yêu cầu</p>
        <Button variant="outline" onClick={() => router.push(ROUTES.ADMIN_BANNERS)}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Chi tiết Banner</h1>
            <p className="text-slate-500 text-sm">
              Cập nhật hình ảnh, đường dẫn và vị trí hiển thị của banner.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <BannerForm initialData={banner} onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
}
