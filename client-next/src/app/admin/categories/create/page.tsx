"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CategoryForm } from "@/features/categories/components/admin/CategoryForm";
import { useCreateCategory } from "@/features/categories/hooks";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function CreateCategoryPage() {
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Thêm danh mục mới
            </h1>
            <p className="text-slate-500 text-sm">
              Tạo danh mục sản phẩm mới để phân loại hàng hóa trong cửa hàng.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <CategoryForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
}
