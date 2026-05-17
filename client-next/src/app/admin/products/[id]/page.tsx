"use client";

import { useProductDetail, useUpdateProduct } from "@/features/products/hooks";
import { ProductForm } from "@/features/products/components/admin/ProductForm";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { adminUI } from "@/constants/admin-ui";

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
      metaTitle: data.metaTitle,
      metaDesc: data.metaDesc,
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
    });
  };

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      {/* Header */}
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
            <h1 className={adminUI.typography.heading}>Chỉnh sửa sản phẩm</h1>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 mt-1">
              <span>Sản phẩm</span>
              <span className="text-[10px]">›</span>
              <span className="text-slate-800">
                {product ? product.name : "Đang tải..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="w-full">
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
