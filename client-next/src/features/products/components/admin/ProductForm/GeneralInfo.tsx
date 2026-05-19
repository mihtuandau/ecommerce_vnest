"use client";

import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { FileText, DollarSign, Globe, Package } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { cn } from "@/utils/cn";
import { adminUI } from "@/constants/admin-ui";
import { Category } from "@/types/models";
import { ProductFormValues } from "../ProductForm";

interface GeneralInfoProps {
  form: UseFormReturn<ProductFormValues>;
  categories: Category[];
}

export function ProductBasicInfo({ form }: { form: UseFormReturn<ProductFormValues> }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
        <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-500" /> Tên & Mô tả sản phẩm
        </h3>
      </div>
      <div className="p-6 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-semibold text-slate-700">
                Tên sản phẩm
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: Áo thun nam"
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100/50 transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-semibold text-slate-700">
                Đường dẫn (Slug)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="ao-thun-nam"
                  className="h-12 rounded-xl font-mono text-sm border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100/50 transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-semibold text-slate-700">
                Mô tả chi tiết
              </FormLabel>
              <FormControl>
                <textarea
                  className="w-full min-h-[200px] rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100/50 transition-all duration-200 leading-relaxed text-slate-700"
                  placeholder="Nhập mô tả chi tiết sản phẩm..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export function ProductCategory({
  form,
  categories,
}: {
  form: UseFormReturn<ProductFormValues>;
  categories: Category[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
        <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          <Package className="h-4 w-4 text-slate-500" /> Danh mục sản phẩm
        </h3>
      </div>
      <div className="p-6 space-y-6">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-semibold text-slate-700">
                Danh mục sản phẩm
              </FormLabel>
              <Select
                key={categories.length}
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value ? String(field.value) : ""}
              >
                <FormControl>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/30 text-slate-800 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100/50 transition-all duration-200">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl admin-theme">
                  {categories?.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={String(cat.id)}
                      className="rounded-lg"
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export function ProductPricing({ form }: { form: UseFormReturn<ProductFormValues> }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
        <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-slate-500" /> Giá cả & Khuyến mãi
        </h3>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px] font-semibold text-slate-700">
                  Giá bán (VNĐ)
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Ví dụ: 36.990.000"
                    className="h-12 rounded-xl font-semibold text-sm text-slate-800 border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100/50 transition-all duration-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px] font-semibold text-slate-700">
                  Giá gốc (VNĐ)
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Ví dụ: 40.000.000"
                    className="h-12 rounded-xl font-semibold text-sm text-slate-800 border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100/50 transition-all duration-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export function ProductStatus({ form }: { form: UseFormReturn<ProductFormValues> }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
        <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          <Globe className="h-4 w-4 text-slate-500" /> Trạng thái hiển thị
        </h3>
      </div>
      <div className="p-6">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel className="text-sm font-bold text-slate-900">
                  Trạng thái hiển thị
                </FormLabel>
                <FormDescription className="text-[10px] text-slate-500">
                  Bật để hiển thị trên cửa hàng
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === "active"}
                  onCheckedChange={(checked) =>
                    field.onChange(checked ? "active" : "inactive")
                  }
                  className="data-[state=checked]:!bg-green-500"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export function ProductSEO({ form }: { form: UseFormReturn<ProductFormValues> }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
        <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          <Globe className="h-4 w-4 text-slate-500" /> Tối ưu hóa SEO
        </h3>
      </div>
      <div className="p-6 space-y-6">
        <p className="text-xs text-slate-500 font-medium">
          Cải thiện thứ hạng tìm kiếm của sản phẩm trên Google.
        </p>

        <FormField
          control={form.control}
          name="metaTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-semibold text-slate-700">
                Tiêu đề trang (Meta Title)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: Áo Sơ Mi Nam Công Sở | VNEST"
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/30 text-slate-800 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100/50 transition-all duration-200"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metaDesc"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-semibold text-slate-700">
                Mô tả trang (Meta Description)
              </FormLabel>
              <FormControl>
                <textarea
                  placeholder="Nhập mô tả ngắn gọn về sản phẩm để hiển thị trên kết quả tìm kiếm..."
                  className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100/50 transition-all duration-200 text-slate-700 leading-relaxed placeholder:text-slate-400 disabled:opacity-50"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export function ProductShipping({ form }: { form: UseFormReturn<ProductFormValues> }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
        <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          <Package className="h-4 w-4 text-slate-500" /> Vận chuyển & Kích thước
        </h3>
      </div>
      <div className="p-6 space-y-6">
        <p className="text-xs text-slate-500 font-medium">
          Kích thước đóng gói chung cho sản phẩm này.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="packageWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px] font-semibold text-slate-700">
                  Trọng lượng (Gram)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100/50 transition-all duration-200"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="packageLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px] font-semibold text-slate-700">
                  Chiều dài (cm)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100/50 transition-all duration-200"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="packageWidth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px] font-semibold text-slate-700">
                  Chiều rộng (cm)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100/50 transition-all duration-200"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="packageHeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px] font-semibold text-slate-700">
                  Chiều cao (cm)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100/50 transition-all duration-200"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
