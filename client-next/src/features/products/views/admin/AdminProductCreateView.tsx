"use client";

import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { ProductForm } from "@/features/products/components/admin/create/ProductForm";
import { useCreateProduct } from "@/features/products/hooks";
import { mapProductFormToCreateDto } from "@/features/products/services";

export function AdminProductCreateView() {
  const router = useRouter();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleSubmit = async (data: any) => {
    createProduct(mapProductFormToCreateDto(data), {
      onSuccess: () => router.push("/admin/products"),
    });
  };

  return (
    <div className="space-y-6 pb-10">
      <AdminPageHeader
        title="Thêm sản phẩm mới"
        description="Tạo sản phẩm mới, thiết lập hình ảnh, giá bán, tồn kho và biến thể."
        eyebrow="Sản phẩm"
        onBack={() => router.back()}
      />

      <ProductForm
        isLoading={isPending}
        onSubmit={handleSubmit}
        submitLabel="Tạo sản phẩm"
      />
    </div>
  );
}
