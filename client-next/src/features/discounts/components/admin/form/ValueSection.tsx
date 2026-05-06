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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/Select";
import { Banknote, Percent } from "lucide-react";

import { DiscountFormValues } from "../DiscountForm";

interface ValueSectionProps {
  form: UseFormReturn<DiscountFormValues>;
}

export function ValueSection({ form }: ValueSectionProps) {
  const discountType = form.watch("type");

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <Banknote className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-base text-slate-800">Giá trị giảm giá</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-xs tracking-wide text-slate-600">Loại giảm giá</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || "PERCENTAGE"}>
                <FormControl>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 text-foreground font-medium focus:ring-primary/20">
                    <SelectValue placeholder="Chọn loại giảm giá" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-slate-200">
                  <SelectItem value="PERCENTAGE" className="rounded-lg">Theo phần trăm (%)</SelectItem>
                  <SelectItem value="FIXED" className="rounded-lg">Số tiền cố định (đ)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={discountType === "PERCENTAGE" ? "percentage" : "fixedAmount"}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-xs tracking-wide text-slate-600">
                Mức giảm {discountType === "PERCENTAGE" ? "(%)" : "(VNĐ)"}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder={discountType === "PERCENTAGE" ? "Ví dụ: 10" : "Ví dụ: 50.000"} 
                    className="h-12 rounded-xl border-slate-200 focus:ring-primary/20 font-semibold text-primary" 
                    {...field} 
                    value={field.value ?? ""} 
                    onChange={e => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {discountType === "PERCENTAGE" ? (
                      <Percent className="h-4 w-4 text-slate-300" />
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">đ</span>
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="minOrderAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-xs tracking-wide text-slate-600">Đơn hàng tối thiểu</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ví dụ: 100.000" 
                  className="h-12 rounded-xl border-slate-200 focus:ring-primary/20" 
                  {...field} 
                  value={field.value ?? ""}
                  onChange={e => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxDiscountAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-xs tracking-wide text-slate-600">Giảm tối đa (VNĐ)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ví dụ: 20.000" 
                  className="h-12 rounded-xl border-slate-200 focus:ring-primary/20" 
                  {...field} 
                  value={field.value ?? ""}
                  onChange={e => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
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
