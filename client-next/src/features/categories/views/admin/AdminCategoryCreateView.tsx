"use client";

import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { CategoryForm } from "@/features/categories/components/admin";
import { useCreateCategory } from "@/features/categories/hooks";

export function AdminCategoryCreateView() {
  const router = useRouter();
  const { mutate: createCategory, isPending } = useCreateCategory();

  const handleSubmit = (formData: FormData) => {
    createCategory(formData, {
      onSuccess: () => {
        router.push("/admin/categories");
      },
    });
  };

  return (
    <div className="space-y-6 pb-10">
      <AdminPageHeader
        title="Thêm danh mục mới"
        description="Tạo danh mục sản phẩm mới để phân loại hàng hóa trong cửa hàng."
        eyebrow="Danh mục"
        onBack={() => router.back()}
      />

      <CategoryForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}
