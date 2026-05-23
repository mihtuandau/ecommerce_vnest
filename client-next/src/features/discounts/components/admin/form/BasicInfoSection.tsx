"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Hash, ImagePlus, FileText, Layout } from "lucide-react";

interface BasicInfoSectionProps {
  form: UseFormReturn<any>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-white p-2 shadow-sm">
            <Layout className="h-4 w-4 text-teal-600" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            Thông tin nhận diện
          </h3>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Hash className="h-3 w-3 text-slate-400" />
                  Mã chương trình
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ví dụ: SUMMER2024"
                    className="h-11 rounded-xl border-slate-200 text-sm font-medium uppercase text-slate-800 placeholder:font-normal placeholder:text-slate-300 focus:border-teal-500 focus:ring-teal-100"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <p className="text-xs font-medium text-slate-500">
                  Khách hàng sẽ nhập mã này tại màn hình thanh toán.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <ImagePlus className="h-3 w-3 text-slate-400" />
                  Ảnh banner (URL)
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="group relative">
                      <Input
                        placeholder="Liên kết hình ảnh quảng bá..."
                        className="h-11 rounded-xl border-slate-200 text-sm font-medium text-slate-800 focus:border-teal-500 focus:ring-teal-100"
                        {...field}
                        value={field.value ?? ""}
                      />
                      <ImagePlus className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-teal-600" />
                    </div>

                    {field.value && (
                      <div className="group relative aspect-[21/9] w-full cursor-zoom-in overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-inner">
                        <img
                          src={field.value}
                          alt="Banner preview"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.png";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FileText className="h-3 w-3 text-slate-400" />
                Mô tả chiến dịch
              </FormLabel>
              <FormControl>
                <textarea
                  className="min-h-[100px] w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal leading-relaxed text-slate-800 transition-all placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-100"
                  placeholder="Viết một vài dòng mô tả về mục tiêu hoặc thông điệp của chương trình này..."
                  {...field}
                  value={field.value ?? ""}
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
