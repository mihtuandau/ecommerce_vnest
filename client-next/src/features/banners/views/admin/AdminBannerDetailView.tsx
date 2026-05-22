"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants/routes";
import { BannerForm } from "@/features/banners/components/admin";
import { useBannerDetail, useUpdateBanner } from "@/features/banners/hooks";

export function AdminBannerDetailView() {
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
        <Spinner size="lg" />
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">
          Đang tải dữ liệu Banner...
        </p>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <p className="text-slate-500 font-semibold">
          Không tìm thấy Banner yêu cầu
        </p>
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
          className="w-fit pl-0 hover:bg-transparent text-slate-400 hover:text-primary gap-1 font-semibold text-xs tracking-wider"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Quay lại danh sách
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Chi tiết Banner
          </h1>
          <p className="text-slate-500 text-sm">
            Cập nhật hình ảnh, đường dẫn và vị trí hiển thị của banner.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <BannerForm
          initialData={banner}
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      </div>
    </div>
  );
}
