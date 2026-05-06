"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Settings2, Users, Zap } from "lucide-react";

import { DiscountFormValues } from "../DiscountForm";

interface UsageSectionProps {
  form: UseFormReturn<DiscountFormValues>;
}

export function UsageSection({ form }: UsageSectionProps) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <Settings2 className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-base text-slate-800">Cấu hình sử dụng</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="usageLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-xs tracking-wide text-slate-600">Giới hạn sử dụng</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="Ví dụ: 100" 
                    className="h-12 rounded-xl border-slate-200 focus:ring-primary/20" 
                    {...field} 
                    value={field.value ?? ""}
                    onChange={e => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                  />
                  <Users className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-xs tracking-wide text-slate-600">Ngày bắt đầu</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  className="h-12 rounded-xl border-slate-200 focus:ring-primary/20 font-medium" 
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
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-xs tracking-wide text-slate-600">Ngày kết thúc</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  className="h-12 rounded-xl border-slate-200 focus:ring-primary/20 font-medium" 
                  {...field} 
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-xl border border-slate-100 p-4 bg-slate-50">
              <div className="space-y-0.5">
                <FormLabel className="text-sm font-semibold text-slate-800">Trạng thái kích hoạt</FormLabel>
                <FormDescription className="text-xs text-slate-500 italic">Mã có hiệu lực ngay sau khi lưu</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:!bg-green-500"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFlashSale"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-xl border border-rose-100 p-4 bg-rose-50/10">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <FormLabel className="text-sm font-semibold text-rose-600">Flash Sale</FormLabel>
                  <Zap className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                </div>
                <FormDescription className="text-xs text-rose-400 italic">Áp dụng tự động cho sản phẩm</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:!bg-red-500"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
