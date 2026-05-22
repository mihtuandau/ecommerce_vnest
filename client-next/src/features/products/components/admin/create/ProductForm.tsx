"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { Spinner } from "@/components/ui/Spinner";
import { productsApi } from "@/features/products/api";
import { useCategories } from "@/features/products/hooks";
import { productSchema, type ProductFormValues } from "@/features/products/schemas";
import {
  mapProductToFormValues,
  normalizeProductFormSubmit,
} from "@/features/products/services";
import { slugify } from "@/utils/slugify";
import type { Product } from "@/types/models";
import {
  ProductBasicInfo,
  ProductCategory,
  ProductPricing,
  ProductSEO,
  ProductShipping,
  ProductStatus,
} from "./GeneralInfo";
import { Media } from "./ProductMedia";
import { Variants } from "./ProductVariants";

interface ProductFormProps {
  initialData?: Product | null;
  isLoading?: boolean;
  onSubmit: (data: ProductFormValues) => void;
  submitLabel?: string;
}

export function ProductForm({
  initialData,
  isLoading,
  onSubmit,
  submitLabel = initialData ? "Lưu thay đổi" : "Tạo sản phẩm",
}: ProductFormProps) {
  const { data: categoryData = [] } = useCategories();
  const categories = Array.isArray(categoryData)
    ? categoryData
    : (categoryData as any)?.data || [];

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
    if (!initialData || categories.length === 0) return;

    const mappedProduct = mapProductToFormValues(initialData);
    form.reset(mappedProduct.values);
    setImages(mappedProduct.images);

    if (mappedProduct.categoryId > 0) {
      setTimeout(() => form.setValue("categoryId", mappedProduct.categoryId), 0);
    }
  }, [initialData, categories, form]);

  const name = form.watch("name");
  useEffect(() => {
    if (!initialData && name) {
      form.setValue("slug", slugify(name), { shouldValidate: true });
    }
  }, [name, form, initialData]);

  const onFormSubmit = (data: ProductFormValues) => {
    onSubmit(normalizeProductFormSubmit(data, images) as any);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newUrls = await Promise.all(
        Array.from(files).map((file) => productsApi.uploadImage(file))
      );
      setImages((prev) => [...prev, ...newUrls].slice(0, 10));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleVariantFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || currentVariantIndex === null) return;

    const index = currentVariantIndex;
    setVariantUploadingIndex(index);
    try {
      const url = await productsApi.uploadImage(files[0]);
      const updatedVariants = [...(form.getValues("variants") || [])];
      updatedVariants[index] = { ...updatedVariants[index], image: url };
      form.setValue("variants", updatedVariants);
    } catch (err) {
      console.error("Variant upload failed", err);
    } finally {
      setVariantUploadingIndex(null);
      setCurrentVariantIndex(null);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onFormSubmit, (errors) =>
          console.error("Form validation failed:", errors)
        )}
        className="space-y-6"
      >
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
                className="bg-teal-700 hover:bg-teal-800 text-white rounded-xl h-10 px-6 text-sm font-medium shadow-sm flex items-center gap-2 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner size="sm" variant="white" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>{submitLabel}</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
