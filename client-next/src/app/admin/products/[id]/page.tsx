"use client";

import { useProductDetail, useUpdateProduct } from "@/features/products/hooks";
import { ProductForm } from "@/features/products/components/admin/ProductForm";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export default function AdminProductDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: product, isLoading } = useProductDetail(id, true);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const handleSubmit = (data: any) => {
    // Filter data to only include fields allowed by UpdateProductDto
    const { images, variants, id: _, createdAt: __, updatedAt: ___, ...updateData } = data;
    
    // Clean numeric values
    const cleanNumber = (val: any) => {
      if (typeof val === 'string') {
        const cleaned = val.replace(/[.,\s]/g, '');
        return cleaned ? Number(cleaned) : 0;
      }
      return Number(val || 0);
    };

    // Explicitly pick fields to be safe
    const cleanUpdateData: any = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      basePrice: cleanNumber(data.basePrice),
      categoryId: Number(data.categoryId),
      status: data.status,
      images: images || [],
      variants: variants || [],
    };

    // Only include originalPrice if it's a positive number
    const originalPrice = cleanNumber(data.originalPrice);
    if (originalPrice > 0) {
      cleanUpdateData.originalPrice = originalPrice;
    }

    console.log("Updating product with data:", cleanUpdateData);

    updateProduct({ id, data: cleanUpdateData }, {
      onSuccess: () => router.push("/admin/products"),
      onError: (err: any) => {
        const msg = err?.response?.data?.message || err?.message || "Lỗi không xác định";
        alert(`Lỗi từ Server: ${Array.isArray(msg) ? msg.join(", ") : msg}`);
      }
    });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-700 font-medium mb-2 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại danh sách
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Chỉnh sửa sản phẩm</h1>
          <p className="text-slate-500 text-sm">
            {product ? product.name : "Đang tải thông tin sản phẩm..."}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl">
        {isLoading ? (
          <div className="flex h-96 items-center justify-center bg-white rounded-xl border border-slate-200">
            <div className="flex flex-col items-center gap-3">
              <Spinner size="lg" />
              <p className="text-sm font-semibold text-slate-400">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : (
          <ProductForm 
            key={product?.id || 'new'} 
            initialData={product} 
            onSubmit={handleSubmit} 
            isLoading={isPending} 
          />
        )}
      </div>
    </div>
  );
}
