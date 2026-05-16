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
import { Settings2, Users, Zap, Calendar, Clock, Lock } from "lucide-react";
import { cn } from "@/utils/cn";

interface UsageSectionProps {
  form: UseFormReturn<any>;
}

export function UsageSection({ form }: UsageSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Lock className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm tracking-tight">Quy tắc & Thời hạn</h3>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="font-bold text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Bắt đầu vào lúc
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Input 
                      type="datetime-local" 
                      className="h-11 rounded-xl border-slate-200 focus:ring-primary/10 font-bold text-sm pr-10 cursor-pointer text-slate-700" 
                      {...field} 
                      value={field.value ?? ""}
                      onClick={(e) => e.currentTarget.showPicker?.()}
                    />
                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary pointer-events-none transition-colors" />
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
                <FormLabel className="font-bold text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Kết thúc vào lúc
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Input 
                      type="datetime-local" 
                      className="h-11 rounded-xl border-slate-200 focus:ring-primary/10 font-bold text-sm pr-10 cursor-pointer text-slate-700" 
                      {...field} 
                      value={field.value ?? ""}
                      onClick={(e) => e.currentTarget.showPicker?.()}
                    />
                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary pointer-events-none transition-colors" />
                  </div>
                </FormControl>
                <FormDescription className="text-[10px] text-slate-400 font-medium italic">Bỏ trống nếu mã không bao giờ hết hạn.</FormDescription>
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
              <FormLabel className="font-bold text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Users className="h-3 w-3" />
                Tổng số lượt dùng tối đa
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="Ví dụ: 500" 
                    className="h-11 rounded-xl border-slate-200 focus:ring-primary/10 font-bold text-lg pl-4 pr-12" 
                    {...field} 
                    value={field.value ?? ""}
                    onChange={e => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">LƯỢT</div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 pt-4 border-t border-slate-100">
           <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">Trạng thái vận hành</h4>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-slate-100 p-5 bg-slate-50 transition-all hover:bg-slate-100/50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-bold text-slate-800">Kích hoạt mã</FormLabel>
                      <FormDescription className="text-[10px] text-slate-500 font-medium italic">Cho phép sử dụng ngay lập tức</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:!bg-emerald-500 shadow-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFlashSale"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-rose-100 p-5 bg-rose-50/20 transition-all hover:bg-rose-50/40">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-sm font-bold text-rose-600">Flash Sale</FormLabel>
                        <div className="bg-rose-500 rounded-full p-0.5">
                          <Zap className="h-2.5 w-2.5 text-white fill-white" />
                        </div>
                      </div>
                      <FormDescription className="text-[10px] text-rose-400 font-medium italic">Áp dụng trực tiếp tại Storefront</FormDescription>
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
