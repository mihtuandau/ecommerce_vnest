"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { nameSchema } from "@/lib/zod";
import { Form } from "@/components/ui/Form" ;
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useCategories } from "../../hooks";
import { productsApi } from "../../api";
import { Product } from "@/types/models";
import { Save, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { GeneralInfo } from "./ProductForm/GeneralInfo";
import { Variants } from "./ProductForm/Variants";
import { Media } from "./ProductForm/Media";
import { slugify } from "@/utils/slugify";

const productSchema = z.object({
  name: nameSchema,
  slug: z.string().min(3, "Slug phải có ít nhất 3 ký tự"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  basePrice: z.coerce.number().min(0, "Giá không được âm"),
  originalPrice: z.coerce.number().min(0).optional(),
  categoryId: z.coerce.number().min(1, "Vui lòng chọn danh mục"),
  brandId: z.coerce.number().optional(),
  status: z.enum(["active", "draft", "inactive"]).default("active"),
  images: z.array(z.string()).default([]),
  variants: z.array(z.object({
    id: z.union([z.string(), z.number()]).optional(),
    size: z.string().nullable().optional(),
    color: z.string().nullable().optional(),
    sku: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    price: z.coerce.number().min(0).optional(),
    stock: z.coerce.number().min(0).default(0),
  })).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: ProductFormValues) => void;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const { data: categories = [] } = useCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const variantFileInputRef = useRef<HTMLInputElement>(null);
  const [currentVariantIndex, setCurrentVariantIndex] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [variantUploadingIndex, setVariantUploadingIndex] = useState<number | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      basePrice: 0,
      originalPrice: 0,
      categoryId: 0,
      status: "active",
      images: [],
      variants: [],
    },
  });

  useEffect(() => {
    if (initialData && categories.length > 0) {
      const data = initialData as any;
      const catId = Number(data.categoryId || data.category?.id || (typeof data.category === 'number' ? data.category : 0) || 0);
      
      form.reset({
        name: data.name,
        slug: data.slug,
        description: data.description || "",
        basePrice: data.basePrice || data.price || 0,
        originalPrice: data.originalPrice || 0,
        categoryId: catId,
        status: data.status || (data.isActive ? "active" : "inactive"),
        images: data.images?.map((img: any) => typeof img === "string" ? img : img.url) || [],
        variants: (data.variants || []).map((v: any) => ({
          ...v,
          price: v.price || 0,
          stock: v.stock || 0,
          image: v.image?.url || v.image || (v.images?.[0]?.url || v.images?.[0] || "")
        })),
      });
      setImages(data.images?.map((img: any) => typeof img === "string" ? img : img.url) || []);
      
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
    console.log("Form values validated successfully:", data);
    
    const cleanNumber = (val: any) => {
      if (typeof val === 'string') {
        // Remove all dots and commas for VND
        const cleaned = val.replace(/[.,\s]/g, '');
        return cleaned ? Number(cleaned) : 0;
      }
      return Number(val || 0);
    };

    const basePrice = cleanNumber(data.basePrice || 0);
    const cleanedVariants = (data.variants || []).map((v: any) => ({
      ...v,
      price: cleanNumber(v.price) > 0 ? cleanNumber(v.price) : basePrice,
      stock: Number(v.stock || 0),
    }));

    if (!initialData) {
      // Structure data for backend CreateProductDto (Strict)
      const dto = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        basePrice: basePrice,
        originalPrice: cleanNumber(data.originalPrice),
        categoryId: Number(data.categoryId),
        status: data.status || "active",
        images: images,
        variants: cleanedVariants,
      };
      onSubmit(dto as any);
    } else {
      // For Update, we can be more flexible
      onSubmit({ ...data, images, variants: cleanedVariants });
    }
  };

  const onInvalid = (errors: any) => {
    console.error("Form validation failed:", errors);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        const uploadPromises = Array.from(files).map(file => productsApi.uploadImage(file));
        const newUrls = await Promise.all(uploadPromises);
        setImages(prev => [...prev, ...newUrls].slice(0, 10));
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
        <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleFileChange} />
        <input type="file" ref={variantFileInputRef} className="hidden" accept="image/*" onChange={handleVariantFileChange} />

        {categories.length === 0 ? (
          <div className="flex h-64 items-center justify-center bg-white rounded-xl border border-slate-200">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs font-medium text-slate-400">Đang chuẩn bị dữ liệu...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="general" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <TabsList className="bg-slate-100 p-1 rounded-xl border border-slate-200">
                <TabsTrigger value="general" className="rounded-lg px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-slate-500">
                  Thông tin chung
                </TabsTrigger>
                <TabsTrigger value="variants" className="rounded-lg px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-slate-500">
                  Biến thể & Kho
                </TabsTrigger>
                <TabsTrigger value="media" className="rounded-lg px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-slate-500">
                  Hình ảnh
                </TabsTrigger>
              </TabsList>

              <Button type="submit" className="h-10 px-8 rounded-lg font-bold gap-2 bg-primary text-white hover:bg-slate-800 shadow-sm" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {initialData ? "Lưu thay đổi" : "Tạo sản phẩm"}
              </Button>
            </div>

            <TabsContent value="general">
              <GeneralInfo form={form} categories={categories} />
            </TabsContent>

            <TabsContent value="variants">
              <Variants 
                form={form} 
                variantUploadingIndex={variantUploadingIndex} 
                onVariantImageClick={(index) => {
                  setCurrentVariantIndex(index);
                  setTimeout(() => variantFileInputRef.current?.click(), 0);
                }} 
              />
            </TabsContent>

            <TabsContent value="media">
              <Media 
                images={images} 
                isUploading={isUploading} 
                onImageAdd={() => fileInputRef.current?.click()} 
                onImageRemove={(index) => setImages(images.filter((_, i) => i !== index))} 
              />
            </TabsContent>
          </Tabs>
        )}
      </form>
    </Form>
  );
}
