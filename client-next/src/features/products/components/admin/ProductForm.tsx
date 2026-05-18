"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { nameSchema } from "@/lib/zod";
import { Form } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { useCategories } from "../../hooks";
import { productsApi } from "../../api";
import { Product } from "@/types/models";
import { Save } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useState, useEffect, useRef } from "react";
import { ProductBasicInfo, ProductCategory, ProductPricing, ProductStatus, ProductSEO, ProductShipping } from "./ProductForm/GeneralInfo";
import { Variants } from "./ProductForm/Variants";
import { Media } from "./ProductForm/Media";
import { slugify } from "@/utils/slugify";
import { adminUI } from "@/constants/admin-ui";
import { cn } from "@/utils/cn";

const productSchema = z.object({
  name: nameSchema,
  slug: z.string().min(3, "Slug phải có ít nhất 3 ký tự"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  basePrice: z.coerce.number().min(0, "Giá không được âm"),
  originalPrice: z.coerce.number().min(0).optional(),
  categoryId: z.coerce.number().min(1, "Vui lòng chọn danh mục"),
  brandId: z.coerce.number().optional(),
  status: z.enum(["active", "draft", "inactive"]),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  packageWeight: z.coerce.number().min(0).optional(),
  packageLength: z.coerce.number().min(0).optional(),
  packageWidth: z.coerce.number().min(0).optional(),
  packageHeight: z.coerce.number().min(0).optional(),
  images: z.array(z.string()),
  variants: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]).optional(),
        size: z.string().nullable().optional(),
        color: z.string().nullable().optional(),
        sku: z.string().nullable().optional(),
        image: z.string().nullable().optional(),
        price: z.coerce.number().min(0).optional(),
        originalPrice: z.coerce.number().min(0).optional(),
        stock: z.coerce.number().min(0).default(0),
      })
    )
    .optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: ProductFormValues) => void;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const { data: categoryData = [] } = useCategories();
  const categories = Array.isArray(categoryData) ? categoryData : (categoryData as any)?.data || [];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const variantFileInputRef = useRef<HTMLInputElement>(null);
  const [currentVariantIndex, setCurrentVariantIndex] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [variantUploadingIndex, setVariantUploadingIndex] = useState<number | null>(
    null
  );

  const form = useForm<any>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      basePrice: 0,
      originalPrice: 0,
      categoryId: 0,
      status: "active",
      metaTitle: "",
      metaDesc: "",
      packageWeight: 0,
      packageLength: 0,
      packageWidth: 0,
      packageHeight: 0,
      images: [],
      variants: [],
    },
  });

  useEffect(() => {
    if (initialData && categories.length > 0) {
      const catId = Number(
        initialData.categoryId ||
          (initialData as Product & { category?: { id?: number } | number }).category
            ?.id ||
          (typeof (initialData as Product & { category?: { id?: number } | number })
            .category === "number"
            ? (initialData as Product & { category?: { id?: number } | number })
                .category
            : 0) ||
          0
      );

      form.reset({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || "",
        basePrice: initialData.basePrice || 0,
        originalPrice: initialData.originalPrice || 0,
        categoryId: catId,
        status:
          (initialData as any).status ||
          ((initialData.isActive ? "active" : "inactive") as any),
        metaTitle: initialData.metaTitle || "",
        metaDesc: initialData.metaDesc || "",
        // We take the dimensions from the first variant if they exist
        packageWeight: initialData.variants?.[0]?.weight || 0,
        packageLength: initialData.variants?.[0]?.length || 0,
        packageWidth: initialData.variants?.[0]?.width || 0,
        packageHeight: initialData.variants?.[0]?.height || 0,
        images:
          initialData.images?.map((img: string | { url: string }) =>
            typeof img === "string" ? img : img.url
          ) || [],
        variants: (initialData.variants || []).map((v: any) => ({
          ...v,
          price: v.price || 0,
          stock: v.stock || 0,
          image:
            v.images && v.images.length > 0
              ? typeof v.images[0] === "string"
                ? v.images[0]
                : v.images[0].url
              : typeof v.image === "string"
              ? v.image
              : v.image?.url || "",
        })),
      });
      setImages(
        initialData.images?.map((img: string | { url: string }) =>
          typeof img === "string" ? img : img.url
        ) || []
      );

      // Force set categoryId again just in case reset didn't catch it for the Select component
      if (catId > 0) {
        setTimeout(() => form.setValue("categoryId", catId), 0);
      }
    }
  }, [initialData, categories, form]);

  // Auto-generate slug from name
  const name = form.watch("name");
  useEffect(() => {
    if (!initialData && name) {
      form.setValue("slug", slugify(name), { shouldValidate: true });
    }
  }, [name, form, initialData]);

  const onFormSubmit = (data: ProductFormValues) => {
    const cleanNumber = (val: string | number | undefined | null) => {
      if (typeof val === "string") {
        // Remove all dots and commas for VND
        const cleaned = val.replace(/[.,\s]/g, "");
        return cleaned ? Number(cleaned) : 0;
      }
      return Number(val || 0);
    };

    const basePrice = cleanNumber(data.basePrice || 0);
    const originalPrice = cleanNumber(data.originalPrice);
    const cleanedVariants = (data.variants || []).map((v) => ({
      ...v,
      price: cleanNumber(v.price) > 0 ? cleanNumber(v.price) : basePrice,
      originalPrice: v.originalPrice ? cleanNumber(v.originalPrice) : null,
      stock: Number(v.stock || 0),
      weight: Number(data.packageWeight || 0),
      packageLength: Number(data.packageLength || 0),
      width: Number(data.packageWidth || 0),
      height: Number(data.packageHeight || 0),
    }));

    // Common payload structure for both Create and Update
    const payload = {
      ...data,
      basePrice,
      originalPrice,
      images,
      variants: cleanedVariants,
      categoryId: Number(data.categoryId),
      status: data.status || "active",
    };

    onSubmit(payload as any);
  };

  const onInvalid = (errors: Record<string, any>) => {
    console.error("Form validation failed:", errors);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        const uploadPromises = Array.from(files).map((file) =>
          productsApi.uploadImage(file)
        );
        const newUrls = await Promise.all(uploadPromises);
        setImages((prev) => [...prev, ...newUrls].slice(0, 10));
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleVariantFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && currentVariantIndex !== null) {
      const index = currentVariantIndex;
      setVariantUploadingIndex(index);
      try {
        const url = await productsApi.uploadImage(files[0]);
        const currentVariants = form.getValues("variants") || [];
        const updatedVariants = [...currentVariants];
        updatedVariants[index] = { ...updatedVariants[index], image: url };
        form.setValue("variants", updatedVariants);
      } catch (err) {
        console.error("Variant upload failed", err);
      } finally {
        setVariantUploadingIndex(null);
        setCurrentVariantIndex(null);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit, onInvalid)} className="space-y-8">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <input
          type="file"
          ref={variantFileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleVariantFileChange}
        />

        {categories.length === 0 ? (
          <div className="flex h-64 items-center justify-center bg-white rounded-2xl border-none shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <Spinner size="sm" />
              <p className="text-xs font-medium text-slate-400">
                Đang chuẩn bị dữ liệu...
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-6 pb-20">
            <div className="flex justify-end mb-2">
              <Button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-9 px-6 text-[13px] font-semibold shadow-sm flex items-center gap-1.5 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner size="sm" variant="white" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>{initialData ? "Lưu thay đổi" : "Tạo sản phẩm"}</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column */}
              <div className="lg:col-span-8 space-y-6">
                <ProductBasicInfo form={form as any} />
                <ProductCategory form={form as any} categories={categories} />
                <Variants
                  form={form as any}
                  variantUploadingIndex={variantUploadingIndex}
                  onVariantImageClick={(index) => {
                    setCurrentVariantIndex(index);
                    setTimeout(() => variantFileInputRef.current?.click(), 0);
                  }}
                />
                <ProductSEO form={form as any} />
              </div>

              {/* Right Column */}
              <div className="lg:col-span-4 space-y-6">
                <ProductPricing form={form as any} />
                <ProductShipping form={form as any} />
                <ProductStatus form={form as any} />
                <Media
                  images={images}
                  isUploading={isUploading}
                  onImageAdd={() => fileInputRef.current?.click()}
                  onImageRemove={(index) =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
