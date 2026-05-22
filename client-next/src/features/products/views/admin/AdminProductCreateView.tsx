"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { adminUI } from "@/constants/admin-ui";
import { ProductForm } from "@/features/products/components/admin/create/ProductForm";
import { useCreateProduct } from "@/features/products/hooks";
import { mapProductFormToCreateDto } from "@/features/products/services";

export function AdminProductCreateView() {
  const router = useRouter();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleSubmit = async (data: any) => {
    createProduct(
      mapProductFormToCreateDto(data),
      {
        onSuccess: () => router.push("/admin/products"),
      }
    );
  };

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4 text-slate-600" />
          </Button>
          <div>
            <h1 className={adminUI.typography.heading}>Thêm sản phẩm mới</h1>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 mt-1">
              <span>Sản phẩm</span>
              <span className="text-[10px]">›</span>
              <span className="text-slate-800">Thêm mới</span>
            </div>
          </div>
        </div>
      </div>

      <ProductForm
        isLoading={isPending}
        onSubmit={handleSubmit}
        submitLabel="Tạo sản phẩm"
      />
    </div>
  );
}
