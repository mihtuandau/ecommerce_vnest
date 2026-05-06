"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  Image as ImageIcon, 
  Link as LinkIcon, 
  Hash, 
  Zap, 
  Loader2, 
  Save, 
  Upload, 
  X,
  Type
} from "lucide-react";
import { cn } from "@/utils/cn";

const bannerSchema = z.object({
  title: z.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự"),
  link: z.string().optional(),
  displayOrder: z.coerce.number().min(0),
  isActive: z.boolean(),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  initialData?: any;
  onSubmit: (formData: FormData) => void;
  isLoading?: boolean;
}

export function BannerForm({ initialData, onSubmit, isLoading }: BannerFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<any>({
    resolver: zodResolver(bannerSchema) as any,
    defaultValues: {
      title: "",
      link: "",
      displayOrder: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || "",
        link: initialData.link || "",
        displayOrder: initialData.displayOrder || initialData.order || 0,
        isActive: initialData.isActive ?? true,
      });
      if (initialData.image) {
        setPreviewUrl(initialData.image);
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

  const onFormSubmit = (values: BannerFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    if (values.link) formData.append("link", values.link);
    formData.append("displayOrder", String(values.displayOrder));
    formData.append("isActive", String(values.isActive));
    
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Basic Info & Image */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Info Card */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-7">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <Type className="h-5 w-5 text-slate-400" />
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Thông tin cơ bản
                </h2>
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-slate-500 tracking-wider">Tiêu đề Banner</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: Chương trình khuyến mãi hè 2024"
                          {...field}
                          className="h-11 rounded-xl border-slate-200 text-slate-900 font-medium"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-slate-500 tracking-wider">Đường dẫn liên kết (Link)</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                          <Input
                            placeholder="VD: /products/summer-collection"
                            {...field}
                            className="h-11 rounded-xl border-slate-200 pl-10 text-slate-900 font-medium"
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-[10px] font-medium text-slate-400">
                        Khách hàng sẽ được chuyển hướng khi click vào banner
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Image Card */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-7">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <ImageIcon className="h-5 w-5 text-slate-400" />
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Hình ảnh hiển thị
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
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-[21/9]">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="rounded-lg font-bold gap-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4" /> Thay đổi ảnh
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="rounded-lg font-bold gap-2"
                        onClick={() => {
                          setPreviewUrl(null);
                          setSelectedFile(null);
                        }}
                      >
                        <X className="h-4 w-4" /> Gỡ bỏ
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-slate-400 group-hover:text-slate-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-900">Tải ảnh Banner lên</p>
                      <p className="text-xs text-slate-400 mt-1">Hỗ trợ JPG, PNG. Tỷ lệ khuyên dùng 21:9</p>
                    </div>
                  </div>
                )}
                {!selectedFile && !initialData?.imageUrl && (
                  <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider text-center">Vui lòng chọn hình ảnh banner</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Settings */}
          <div className="space-y-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-7">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <Zap className="h-5 w-5 text-slate-400" />
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Thiết lập hiển thị
                </h2>
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-slate-500 tracking-wider">Thứ tự hiển thị</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                          <Input
                            type="number"
                            {...field}
                            className="h-11 rounded-xl border-slate-200 pl-10 text-slate-900 font-bold"
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-[10px] font-medium text-slate-400">
                        Số nhỏ hơn sẽ hiển thị trước
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border border-slate-100 p-4 bg-slate-50/30">
                      <div className="space-y-0.5">
                        <FormLabel className="text-xs font-bold text-slate-900">
                          Hiển thị công khai
                        </FormLabel>
                        <FormDescription className="text-[10px]">
                          Cho phép banner xuất hiện
                        </FormDescription>
                      </div>
                      <FormControl>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                        </label>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-13 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold gap-2 shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  {initialData ? "Lưu thay đổi" : "Thêm Banner"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
