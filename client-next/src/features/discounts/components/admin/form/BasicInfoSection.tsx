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
import { Hash, ImagePlus, FileText, Layout } from "lucide-react";

interface BasicInfoSectionProps {
  form: UseFormReturn<any>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Layout className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm tracking-tight">Thông tin nhận diện</h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Hash className="h-3 w-3" />
                    Mã chương trình
                  </FormLabel>
                </div>
                <FormControl>
                  <Input 
                    placeholder="Ví dụ: SUMMER2024" 
                    className="h-11 rounded-xl border-slate-200 focus:ring-primary/10 font-bold uppercase tracking-wider text-slate-800 placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-300" 
                    {...field} 
                    value={field.value ?? ""}
                  />
                </FormControl>
                <p className="text-[10px] text-slate-400 font-medium italic">Khách hàng sẽ nhập mã này tại màn hình thanh toán.</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="font-bold text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <ImagePlus className="h-3 w-3" />
                  Ảnh Banner (URL)
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="relative group">
                      <Input 
                        placeholder="Liên kết hình ảnh quảng bá..." 
                        className="h-11 rounded-xl border-slate-200 focus:ring-primary/10 text-sm" 
                        {...field} 
                        value={field.value ?? ""}
                      />
                      <ImagePlus className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    </div>
                    
                    {field.value && (
                      <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shadow-inner group cursor-zoom-in">
                        <img 
                          src={field.value} 
                          alt="Banner Preview" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.png";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
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
              <FormLabel className="font-bold text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <FileText className="h-3 w-3" />
                Mô tả chiến dịch
              </FormLabel>
              <FormControl>
                <textarea
                  className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all leading-relaxed text-slate-700 resize-none placeholder:text-slate-300"
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
