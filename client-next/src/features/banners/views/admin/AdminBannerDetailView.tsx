"use client";

import { useParams, useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
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
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-slate-400">
          Đang tải dữ liệu banner...
        </p>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <p className="text-sm font-medium text-slate-500">
          Không tìm thấy banner yêu cầu
        </p>
        <Button variant="outline" onClick={() => router.push(ROUTES.ADMIN_BANNERS)}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <AdminPageHeader
        title="Chi tiết banner"
        description="Cập nhật hình ảnh, đường dẫn và vị trí hiển thị của banner."
        eyebrow="Banner"
        onBack={() => router.back()}
      />

      <BannerForm
        initialData={banner}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </div>
  );
}
