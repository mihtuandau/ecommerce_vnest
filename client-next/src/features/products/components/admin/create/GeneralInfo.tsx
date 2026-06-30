"use client";

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
import type { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";

import { Category } from "@/types/models";
import type { ProductFormValues } from "../../../schemas";

interface GeneralInfoProps {
  form: UseFormReturn<ProductFormValues>;
  categories: Category[];
}

const cardClass =
  "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)]";
const cardHeaderClass = "border-b border-slate-100 bg-slate-50/30 px-6 py-4";
const cardTitleClass = "flex items-center gap-2 text-base font-semibold text-slate-800";
const labelClass = "text-sm font-medium text-slate-700";
const inputClass =
  "h-12 rounded-xl border-slate-200 bg-slate-50/30 transition-all duration-200 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100/60";

function CardTitle({
  icon: Icon,
  children,
}: {
  icon: typeof FileText;
  children: ReactNode;
}) {
  return (
    <div className={cardHeaderClass}>
      <h3 className={cardTitleClass}>
        <Icon className="h-4 w-4 text-slate-500" />
        {children}
      </h3>
    </div>
  );
}

export function ProductBasicInfo({ form }: { form: UseFormReturn<ProductFormValues> }) {
  return (
    <div className={cardClass}>
      <CardTitle icon={FileText}>Tên & mô tả sản phẩm</CardTitle>
      <div className="space-y-6 p-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Tên sản phẩm</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: Áo thun nam" className={inputClass} {...field} />
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
              <FormLabel className={labelClass}>Đường dẫn (slug)</FormLabel>
              <FormControl>
                <Input
                  placeholder="ao-thun-nam"
                  className={`${inputClass} font-mono text-sm`}
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
              <FormLabel className={labelClass}>Mô tả chi tiết</FormLabel>
              <FormControl>
                <textarea
                  className="min-h-[200px] w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-3 text-sm leading-relaxed text-slate-700 transition-all duration-200 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-100/60"
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

export function ProductCategory({ form, categories }: GeneralInfoProps) {
  return (
    <div className={cardClass}>
      <CardTitle icon={Package}>Danh mục sản phẩm</CardTitle>
      <div className="space-y-6 p-6">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Danh mục sản phẩm</FormLabel>
              <Select
                key={categories.length}
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value ? String(field.value) : ""}
              >
                <FormControl>
                  <SelectTrigger className={`${inputClass} text-slate-800`}>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="admin-theme rounded-xl">
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)} className="rounded-lg">
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
    <div className={cardClass}>
      <CardTitle icon={DollarSign}>Giá cả & khuyến mãi</CardTitle>
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Giá bán (VNĐ)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Ví dụ: 36.990.000"
                    className={`${inputClass} text-sm font-medium text-slate-800`}
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
                <FormLabel className={labelClass}>Giá gốc (VNĐ)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Ví dụ: 40.000.000"
                    className={`${inputClass} text-sm font-medium text-slate-800`}
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
    <div className={cardClass}>
      <CardTitle icon={Globe}>Trạng thái hiển thị</CardTitle>
      <div className="p-6">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel className={labelClass}>Trạng thái hiển thị</FormLabel>
                <FormDescription className="text-xs text-slate-500">
                  Bật để hiển thị trên cửa hàng
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === "active"}
                  onCheckedChange={(checked) =>
                    field.onChange(checked ? "active" : "inactive")
                  }
                  className="data-[state=checked]:!bg-teal-600"
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
    <div className={cardClass}>
      <CardTitle icon={Globe}>Tối ưu hóa SEO</CardTitle>
      <div className="space-y-6 p-6">
        <p className="text-xs font-medium text-slate-500">
          Cải thiện thứ hạng tìm kiếm của sản phẩm trên Google.
        </p>

        <FormField
          control={form.control}
          name="metaTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Tiêu đề trang (Meta Title)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: Áo sơ mi nam công sở | VNEST"
                  className={`${inputClass} text-slate-800`}
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
              <FormLabel className={labelClass}>Mô tả trang (Meta Description)</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Nhập mô tả ngắn gọn về sản phẩm để hiển thị trên kết quả tìm kiếm..."
                  className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-3 text-sm leading-relaxed text-slate-700 transition-all duration-200 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-100/60 disabled:opacity-50"
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
    <div className={cardClass}>
      <CardTitle icon={Package}>Vận chuyển & kích thước</CardTitle>
      <div className="space-y-6 p-6">
        <p className="text-xs font-medium text-slate-500">
          Kích thước đóng gói chung cho sản phẩm này.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="packageWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Trọng lượng (gram)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    className={inputClass}
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
                <FormLabel className={labelClass}>Chiều dài (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    className={inputClass}
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
                <FormLabel className={labelClass}>Chiều rộng (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    className={inputClass}
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
                <FormLabel className={labelClass}>Chiều cao (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    className={inputClass}
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
