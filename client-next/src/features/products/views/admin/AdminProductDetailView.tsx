"use client";

import { useParams, useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { ProductForm } from "@/features/products/components/admin/create/ProductForm";
import { useProductDetail, useUpdateProduct } from "@/features/products/hooks";
import { mapProductFormToUpdateDto } from "@/features/products/services";

export function AdminProductDetailView() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: product, isLoading } = useProductDetail(id, true);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const handleSubmit = (data: any) => {
    updateProduct(
      { id, data: mapProductFormToUpdateDto(data) },
      {
        onSuccess: () => router.push("/admin/products"),
      }
    );
  };

  return (
    <div className="space-y-6 pb-10">
      <AdminPageHeader
        title="Chỉnh sửa sản phẩm"
        description={product ? product.name : "Cập nhật thông tin sản phẩm."}
        eyebrow="Sản phẩm"
        onBack={() => router.back()}
      />

      {isLoading ? (
        <div className="flex h-96 items-center justify-center bg-white rounded-xl border border-slate-200">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-sm font-medium text-slate-400">
              Đang tải dữ liệu...
            </p>
          </div>
        </div>
      ) : (
        <ProductForm
          key={product?.id || "new"}
          initialData={product}
          isLoading={isPending}
          onSubmit={handleSubmit}
          submitLabel="Lưu thay đổi"
        />
      )}
    </div>
  );
}
