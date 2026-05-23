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
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Banknote, Percent, Info, Target } from "lucide-react";
import { cn } from "@/utils/cn";

interface ValueSectionProps {
  form: UseFormReturn<any>;
}

const moneySymbol = "₫";

export function ValueSection({ form }: ValueSectionProps) {
  const type = form.watch("type");

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
      <div className="space-y-6 p-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium text-slate-700">
                Hình thức ưu đãi
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="relative grid w-full max-w-md grid-cols-2 gap-1 rounded-lg border border-slate-200/50 bg-slate-100/80 p-1"
                >
                  <div
                    className="absolute bottom-1 top-1 z-0 rounded-md border border-slate-200/50 bg-white shadow-sm transition-all duration-200"
                    style={{
                      left:
                        field.value === "PERCENTAGE"
                          ? "4px"
                          : "calc(50% + 2px)",
                      width: "calc(50% - 6px)",
                    }}
                  />

                  <label
                    className={cn(
                      "relative z-10 flex cursor-pointer items-center justify-center gap-2.5 rounded-md py-2.5 text-sm transition-all",
                      field.value === "PERCENTAGE"
                        ? "font-medium text-slate-900"
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <RadioGroupItem value="PERCENTAGE" className="sr-only" />
                    <Percent
                      size={14}
                      className={
                        field.value === "PERCENTAGE"
                          ? "text-teal-600"
                          : "text-slate-400"
                      }
                    />
                    <span>Phần trăm (%)</span>
                  </label>

                  <label
                    className={cn(
                      "relative z-10 flex cursor-pointer items-center justify-center gap-2.5 rounded-md py-2.5 text-sm transition-all",
                      field.value === "FIXED"
                        ? "font-medium text-slate-900"
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <RadioGroupItem value="FIXED" className="sr-only" />
                    <Banknote
                      size={14}
                      className={
                        field.value === "FIXED" ? "text-teal-600" : "text-slate-400"
                      }
                    />
                    <span>Số tiền ({moneySymbol})</span>
                  </label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  Mức giảm giá
                  <Target size={12} className="text-slate-400" />
                </FormLabel>
                <FormControl>
                  <div className="group relative">
                    <Input
                      type="number"
                      placeholder="0"
                      className="h-11 rounded-xl border-slate-200 bg-white pl-3 pr-10 text-sm font-medium text-slate-900 shadow-sm transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100/60"
                      {...field}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                      {type === "PERCENTAGE" ? "%" : moneySymbol}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minOrderAmount"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-slate-700">
                  Đơn hàng tối thiểu
                </FormLabel>
                <FormControl>
                  <div className="group relative">
                    <Input
                      type="number"
                      placeholder="0"
                      className="h-11 rounded-xl border-slate-200 bg-white pl-3 pr-10 text-sm font-medium text-slate-900 shadow-sm transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100/60"
                      {...field}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                      {moneySymbol}
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
                  <Info size={10} /> Áp dụng khi tổng đơn đạt mốc này.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === "PERCENTAGE" && (
            <div className="animate-in fade-in slide-in-from-top-1 overflow-hidden duration-200 md:col-span-2">
              <FormField
                control={form.control}
                name="maxDiscountAmount"
                render={({ field }) => (
                  <FormItem className="space-y-2 pt-2">
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Giới hạn mức giảm tối đa
                    </FormLabel>
                    <FormControl>
                      <div className="group relative">
                        <Input
                          type="number"
                          placeholder="Không giới hạn"
                          className="h-11 rounded-xl border-slate-200 bg-white pl-3 pr-10 text-sm font-medium text-slate-900 shadow-sm transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100/60"
                          {...field}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                          {moneySymbol}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-lg border border-teal-100 bg-teal-50/30 p-4">
          <div className="shrink-0 rounded-md border border-teal-100 bg-white p-1.5 shadow-sm">
            <Info className="h-3.5 w-3.5 text-teal-600" />
          </div>
          <p className="text-xs font-medium leading-relaxed text-slate-600">
            <strong className="text-teal-700">Lưu ý quản trị:</strong> Đối với các
            chương trình Flash Sale, mức giảm giá sẽ được trừ trực tiếp vào giá bán
            lẻ. Hãy kiểm tra kỹ biên lợi nhuận trước khi kích hoạt chiến dịch.
          </p>
        </div>
      </div>
    </div>
  );
}
