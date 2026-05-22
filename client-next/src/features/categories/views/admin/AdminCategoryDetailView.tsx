"use client";

import { useParams, useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { CategoryForm } from "@/features/categories/components/admin";
import { useCategoryDetail, useUpdateCategory } from "@/features/categories/hooks";

export function AdminCategoryDetailView() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: category, isLoading } = useCategoryDetail(id);
  const { mutate: updateCategory, isPending } = useUpdateCategory();

  const handleSubmit = (formData: FormData) => {
    updateCategory(
      { id, formData },
      {
        onSuccess: () => {
          router.push("/admin/categories");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-slate-400">
          Đang tải dữ liệu danh mục...
        </p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <p className="text-sm font-medium text-slate-500">
          Không tìm thấy danh mục yêu cầu
        </p>
        <Button variant="outline" onClick={() => router.push("/admin/categories")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <AdminPageHeader
        title="Chi tiết danh mục"
        description={`Cập nhật tên và hình ảnh hiển thị cho danh mục "${category.name}".`}
        eyebrow="Danh mục"
        onBack={() => router.back()}
      />

      <CategoryForm
        initialData={category}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </div>
  );
}
