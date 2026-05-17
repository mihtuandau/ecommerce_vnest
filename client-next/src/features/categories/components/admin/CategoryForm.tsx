"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { nameSchema } from "@/lib/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { 
  ImageIcon,
  Save, 
  Upload, 
  X,
  Type,
  Layers
} from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useCategories } from "@/features/categories/hooks";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/Select";
import { Category } from "@/types/models";

const categorySchema = z.object({
  name: nameSchema,
  parentId: z.string().optional().nullable(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: any;
  onSubmit: (formData: FormData) => void;
  isLoading?: boolean;
}

export function CategoryForm({ initialData, onSubmit, isLoading }: CategoryFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch categories for parent selection
  const { data: categoryData = [] } = useCategories();
  const categories = Array.isArray(categoryData) ? categoryData : (categoryData as any)?.data || [];

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      parentId: "none",
    },
  });

  useEffect(() => {
    if (initialData) {
      // Handle potential wrapped data { success: true, data: { ... } }
      const data = initialData.data || initialData;
      
      const parentIdValue = data.parentId || data.parent_id || (data.parent?.id);
      
      form.reset({
        name: data.name || "",
        parentId: parentIdValue ? String(parentIdValue) : "none",
      });
      if (data.image) {
        setPreviewUrl(data.image);
      }
    }
  }, [initialData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onFormSubmit = (values: CategoryFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    
    if (values.parentId && values.parentId !== "" && values.parentId !== "none") {
      formData.append("parentId", values.parentId);
    } else {
      // For "none" or empty, we want to create a root category
      formData.append("parentId", ""); 
    }
    
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    onSubmit(formData);
  };

  // Filter out the current category from parent list to prevent self-parenting
  const parentOptions = categories.filter((cat: Category) => initialData ? cat.id !== initialData.id : true);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-7">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <Type className="h-5 w-5 text-slate-400" />
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Thông tin danh mục
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Tên danh mục</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: Điện thoại, Máy tính, Thời trang..."
                          {...field}
                          className="h-12 rounded-xl border-slate-200 text-slate-900 font-medium text-base shadow-sm focus:ring-2 focus:ring-slate-900/5 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-slate-500 tracking-wider uppercase flex items-center gap-2">
                        <Layers size={12} />
                        Danh mục cha
                      </FormLabel>
                      <Select 
                        key={categories.length}
                        onValueChange={field.onChange} 
                        defaultValue={field.value ?? undefined}
                        value={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-slate-200 text-slate-900 font-medium text-base shadow-sm focus:ring-2 focus:ring-slate-900/5 transition-all bg-white">
                            <SelectValue placeholder="Chọn danh mục cha" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-slate-200 shadow-xl overflow-hidden p-1 admin-theme">
                          <SelectItem value="none" className="rounded-lg text-slate-600 font-medium py-3">
                            Không có (Danh mục gốc)
                          </SelectItem>
                          {parentOptions.map((cat: Category) => (
                            <SelectItem 
                              key={cat.id} 
                              value={String(cat.id)}
                              className="rounded-lg font-bold text-slate-900 py-3"
                            >
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-[10px] text-slate-400 font-medium">
                        Chọn danh mục gốc nếu đây là danh mục cao nhất.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Image Upload Card */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-7">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <ImageIcon className="h-5 w-5 text-slate-400" />
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Ảnh đại diện danh mục
                </h2>
              </div>

              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                
                {previewUrl ? (
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square max-w-[240px] mx-auto shadow-inner">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="rounded-lg font-bold h-8 text-[10px] uppercase tracking-wider"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Đổi ảnh
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="rounded-lg font-bold h-8 text-[10px] uppercase tracking-wider"
                        onClick={() => {
                          setPreviewUrl(null);
                          setSelectedFile(null);
                        }}
                      >
                        Gỡ bỏ
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer group max-w-[240px] mx-auto aspect-square w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Upload className="h-8 w-8 text-slate-400 group-hover:text-slate-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Tải ảnh lên</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">PNG, JPG (1:1)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="space-y-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-7 sticky top-8">
              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold gap-2 shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner size="sm" variant="white" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  {initialData ? "Lưu thay đổi" : "Tạo danh mục"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                  onClick={() => window.history.back()}
                  disabled={isLoading}
                >
                  Hủy bỏ
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-[11px] font-bold text-amber-800 leading-relaxed uppercase tracking-wider">
                  Lưu ý: Tên danh mục nên ngắn gọn và dễ hiểu để hiển thị tốt nhất trên giao diện người dùng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
