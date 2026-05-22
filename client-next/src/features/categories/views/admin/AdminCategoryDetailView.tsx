"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
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
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Đang tải dữ liệu danh mục...
        </p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <p className="text-slate-500 font-bold">
          Không tìm thấy danh mục yêu cầu
        </p>
        <Button variant="outline" onClick={() => router.push("/admin/categories")}>
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
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Chi tiết danh mục
          </h1>
          <p className="text-slate-500 text-sm">
            Cập nhật tên và hình ảnh hiển thị cho danh mục "{category.name}".
          </p>
        </div>
      </div>

      <div className="pt-2">
        <CategoryForm
          initialData={category}
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      </div>
    </div>
  );
}
