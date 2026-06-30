"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Users, Zap, Calendar, Clock, Lock } from "lucide-react";

interface UsageSectionProps {
  form: UseFormReturn<any>;
}

export function UsageSection({ form }: UsageSectionProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-white p-2 shadow-sm">
            <Lock className="h-4 w-4 text-teal-600" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            Quy tắc & thời hạn
          </h3>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  Bắt đầu vào lúc
                </FormLabel>
                <FormControl>
                  <div className="group relative">
                    <Input
                      type="datetime-local"
                      className="h-11 cursor-pointer rounded-xl border-slate-200 pr-10 text-sm font-medium text-slate-800 focus:border-teal-500 focus:ring-teal-100"
                      {...field}
                      value={field.value ?? ""}
                      onClick={(e) => e.currentTarget.showPicker?.()}
                    />
                    <Clock className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-teal-600" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  Kết thúc vào lúc
                </FormLabel>
                <FormControl>
                  <div className="group relative">
                    <Input
                      type="datetime-local"
                      className="h-11 cursor-pointer rounded-xl border-slate-200 pr-10 text-sm font-medium text-slate-800 focus:border-teal-500 focus:ring-teal-100"
                      {...field}
                      value={field.value ?? ""}
                      onClick={(e) => e.currentTarget.showPicker?.()}
                    />
                    <Clock className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-teal-600" />
                  </div>
                </FormControl>
                <FormDescription className="text-xs font-medium text-slate-500">
                  Bỏ trống nếu mã không bao giờ hết hạn.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="usageLimit"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Users className="h-3 w-3 text-slate-400" />
                Tổng số lượt dùng tối đa
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Ví dụ: 500"
                    className="h-11 rounded-xl border-slate-200 pl-4 pr-12 text-sm font-medium text-slate-800 focus:border-teal-500 focus:ring-teal-100"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.value === "" ? 0 : Number(e.target.value))
                    }
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                    LƯỢT
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 border-t border-slate-100 pt-4">
          <h4 className="mb-4 text-sm font-medium text-slate-600">
            Trạng thái vận hành
          </h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all hover:bg-slate-100/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium text-slate-800">
                      Kích hoạt mã
                    </FormLabel>
                    <FormDescription className="text-xs font-medium text-slate-500">
                      Cho phép sử dụng ngay lập tức
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:!bg-teal-600 shadow-sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFlashSale"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-rose-100 bg-rose-50/20 p-5 transition-all hover:bg-rose-50/40">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <FormLabel className="text-sm font-medium text-rose-600">
                        Flash Sale
                      </FormLabel>
                      <div className="rounded-full bg-rose-500 p-0.5">
                        <Zap className="h-2.5 w-2.5 fill-white text-white" />
                      </div>
                    </div>
                    <FormDescription className="text-xs font-medium text-rose-500">
                      Áp dụng trực tiếp tại storefront
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:!bg-rose-500 shadow-sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
