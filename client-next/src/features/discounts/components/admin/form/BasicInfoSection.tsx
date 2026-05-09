"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Hash, ImagePlus } from "lucide-react";

import { DiscountFormValues } from "../DiscountForm";

interface BasicInfoSectionProps {
  form: UseFormReturn<any>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <Hash className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-base text-slate-800">Thông tin cơ bản</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-xs tracking-wide text-slate-600">Mã giảm giá</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ví dụ: GIAMGIA50" 
                  className="h-12 rounded-xl border-slate-200 focus:ring-primary/20 font-semibold uppercase" 
                  {...field} 
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-xs tracking-wide text-slate-600">Ảnh Banner (URL)</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <div className="relative group">
                    <Input 
                      placeholder="https://example.com/banner.jpg" 
                      className="h-12 rounded-xl border-slate-200 focus:ring-primary/20" 
                      {...field} 
                      value={field.value ?? ""}
                    />
                    <ImagePlus className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                  </div>
                  
                  {field.value && (
                    <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                      <img 
                        src={field.value} 
                        alt="Banner Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.png";
                        }}
                      />
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
          <FormItem>
            <FormLabel className="font-semibold text-xs tracking-wide text-slate-600">Mô tả chương trình</FormLabel>
            <FormControl>
              <textarea
                className="w-full min-h-[120px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all leading-relaxed text-slate-700 resize-none"
                placeholder="Nhập mô tả chi tiết về chương trình khuyến mãi này..."
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
