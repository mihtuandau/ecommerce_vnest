"use client";

import React from "react";
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
import { FileText, DollarSign } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface GeneralInfoProps {
  form: UseFormReturn<any>;
  categories: any[];
}

export function GeneralInfo({ form, categories }: GeneralInfoProps) {
  return (
    <div className="space-y-8 focus-visible:outline-none">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-base text-slate-900">Thông tin cơ bản</h3>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                  Tên sản phẩm
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ví dụ: iPhone 15 Pro Max"
                    className="h-12 rounded-xl border-slate-200 focus:ring-primary/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                    Slug
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="iphone-15-pro"
                      className="h-12 rounded-xl border-slate-200 font-mono text-xs focus:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                    Danh mục
                  </FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value ? String(field.value) : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 text-foreground font-medium focus:ring-primary/20">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-slate-200">
                      {categories?.map((cat: any) => (
                        <SelectItem
                          key={cat.id}
                          value={String(cat.id)}
                          className="rounded-lg"
                        >
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

        <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-base text-slate-900">Giá niêm yết</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                    Giá bán (VNĐ)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Ví dụ: 36.990.000"
                      className="h-12 rounded-xl border-slate-200 font-bold text-primary focus:ring-primary/20"
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
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                    Giá gốc (VNĐ)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Ví dụ: 40.000.000"
                      className="h-12 rounded-xl border-slate-200 text-muted-foreground focus:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-xl border border-slate-100 p-4 bg-slate-50">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-bold text-slate-900">
                    Hiển thị trên cửa hàng
                  </FormLabel>
                  <FormDescription className="text-[10px] text-slate-500">
                    Bật để khách hàng có thể mua sản phẩm này
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch 
                    checked={field.value === "active"} 
                    onCheckedChange={(checked) => field.onChange(checked ? "active" : "inactive")}
                    className="data-[state=checked]:!bg-green-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-base text-slate-900">Mô tả sản phẩm</h3>
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <textarea
                    className="w-full min-h-[300px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all leading-relaxed text-slate-700"
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
    </div>
  );
}
