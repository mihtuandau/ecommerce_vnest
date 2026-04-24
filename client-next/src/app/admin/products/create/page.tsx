"use client";

import { useCreateProduct } from "@/features/products/hooks";
import { ProductForm } from "@/features/products/components/admin/ProductForm";
import { useRouter } from "next/navigation";
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
      images: images || [],
      variants: variants || [],
    };
    
    console.log("Creating product with DTO:", cleanDto);
    
    createProduct(cleanDto, {
      onSuccess: () => {
        router.push("/admin/products");
      },
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Thêm sản phẩm mới</h1>
          <p className="text-slate-500 text-sm">Tạo một mặt hàng mới để thêm vào cửa hàng.</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl">
        <ProductForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
}
