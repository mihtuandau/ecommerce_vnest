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
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Banknote, Percent, Info, Target, Settings2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

interface ValueSectionProps {
  form: UseFormReturn<any>;
}

export function ValueSection({ form }: ValueSectionProps) {
  const type = form.watch("type");

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 space-y-8">
        {/* Discount Type Selector - Segmented Control Style */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-[13px] font-medium text-slate-700">Hình thức ưu đãi</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="relative p-1 bg-slate-100/80 rounded-lg grid grid-cols-2 gap-1 border border-slate-200/50 w-full max-w-md"
                >
                   {/* Sliding Background */}
                   <motion.div 
                     className="absolute top-1 bottom-1 rounded-md bg-white shadow-sm z-0 border border-slate-200/50"
                     initial={false}
                     animate={{ 
                       left: field.value === "PERCENTAGE" ? "4px" : "calc(50% + 2px)",
                       width: "calc(50% - 6px)"
                     }}
                     transition={{ type: "spring", stiffness: 400, damping: 35 }}
                   />

                   <label className={cn(
                     "relative z-10 flex items-center justify-center gap-2.5 py-2.5 rounded-md cursor-pointer transition-all",
                     field.value === "PERCENTAGE" ? "text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-700"
                   )}>
                      <RadioGroupItem value="PERCENTAGE" className="sr-only" />
                      <Percent size={14} className={field.value === "PERCENTAGE" ? "text-blue-600" : "text-slate-400"} />
                      <span className="text-[13px]">Phần trăm (%)</span>
                   </label>

                   <label className={cn(
                     "relative z-10 flex items-center justify-center gap-2.5 py-2.5 rounded-md cursor-pointer transition-all",
                     field.value === "FIXED" ? "text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-700"
                   )}>
                      <RadioGroupItem value="FIXED" className="sr-only" />
                      <Banknote size={14} className={field.value === "FIXED" ? "text-blue-600" : "text-slate-400"} />
                      <span className="text-[13px]">Số tiền (₫)</span>
                   </label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Value Input */}
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
                  Mức giảm giá
                  <Target size={12} className="text-slate-400" />
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Input 
                      type="number" 
                      placeholder="0" 
                      className="h-10 rounded-md border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 font-medium text-[15px] pl-3 pr-10 text-slate-900 transition-all shadow-sm" 
                      {...field} 
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-slate-400 text-[13px]">
                      {type === "PERCENTAGE" ? "%" : "₫"}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Min Order Amount */}
          <FormField
            control={form.control}
            name="minOrderAmount"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[13px] font-medium text-slate-700">Đơn hàng tối thiểu</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Input 
                      type="number" 
                      placeholder="0" 
                      className="h-10 rounded-md border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 font-medium text-[15px] pl-3 pr-10 text-slate-900 transition-all shadow-sm" 
                      {...field} 
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-slate-400 text-[13px]">₫</div>
                  </div>
                </FormControl>
                <FormDescription className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <Info size={10} /> Áp dụng khi tổng đơn đạt mốc này.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Max Discount (Conditional) */}
          <AnimatePresence mode="wait">
            {type === "PERCENTAGE" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:col-span-2 overflow-hidden"
              >
                <FormField
                  control={form.control}
                  name="maxDiscountAmount"
                  render={({ field }) => (
                    <FormItem className="space-y-2 pt-2">
                      <FormLabel className="text-[13px] font-medium text-slate-700">Giới hạn mức giảm tối đa</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input 
                            type="number" 
                            placeholder="Không giới hạn" 
                            className="h-10 rounded-md border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 font-medium text-[15px] pl-3 pr-10 text-slate-900 transition-all shadow-sm" 
                            {...field} 
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-slate-400 text-[13px]">₫</div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Admin Tip Section */}
        <div className="bg-blue-50/30 p-4 rounded-lg border border-blue-100/50 flex gap-3 items-start mt-4">
           <div className="p-1.5 bg-white rounded-md border border-blue-100 shadow-sm shrink-0">
             <Info className="h-3.5 w-3.5 text-blue-500" />
           </div>
           <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
             <strong className="text-blue-700">Lưu ý quản trị:</strong> Đối với các chương trình Flash Sale, mức giảm giá sẽ được trừ trực tiếp vào giá bán lẻ. Hãy kiểm tra kỹ biên lợi nhuận trước khi kích hoạt chiến dịch.
           </p>
        </div>
      </div>
    </div>
  );
}
