"use client";

import { useCreateProduct } from "@/features/products/hooks";
import { ProductForm } from "@/features/products/components/admin/ProductForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { adminUI } from "@/constants/admin-ui";
import { ChevronLeft } from "lucide-react";

export default function AdminProductCreatePage() {
  const router = useRouter();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleSubmit = async (data: any) => {
    const { images, variants } = data;
    
    // Clean numeric values (remove dots, commas, etc if they are strings)
    const cleanNumber = (val: any) => {
      if (typeof val === 'string') {
        const cleaned = val.replace(/[.,\s]/g, '');
        return cleaned ? Number(cleaned) : 0;
      }
      return Number(val || 0);
    };

    // Create a truly clean object with only the fields allowed by CreateProductDto
    const cleanDto = {
      name: String(data.name || ""),
      slug: String(data.slug || ""),
      description: String(data.description || ""),
      basePrice: cleanNumber(data.basePrice),
      originalPrice: cleanNumber(data.originalPrice),
      categoryId: Number(data.categoryId || 0),
      status: data.status || "active",
      metaTitle: data.metaTitle,
      metaDesc: data.metaDesc,
      images: images || [],
      variants: variants || [],
    };
    
    console.log("Creating product with DTO:", cleanDto);
    
    createProduct(cleanDto, {
      onSuccess: () => {
        router.push("/admin/products");
      }
    });
  };

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      {/* Header */}
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
            <h1 className={adminUI.typography.heading}>Thêm sản phẩm mới</h1>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 mt-1">
              <span>Sản phẩm</span>
              <span className="text-[10px]">›</span>
              <span className="text-slate-800">Thêm mới</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="w-full">
        <ProductForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
}
