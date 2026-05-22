"use client";

import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
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
    <div className="space-y-6 pb-10">
      <AdminPageHeader
        title="Thêm banner mới"
        description="Tạo hình ảnh quảng bá sản phẩm và chiến dịch mới cho trang chủ."
        eyebrow="Banner"
        onBack={() => router.back()}
      />

      <BannerForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}
