"use client";

import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Tag, Plus, Trash, ImagePlus, Loader2 } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { cn } from "@/utils/cn";

interface VariantsProps {
  form: UseFormReturn<any>;
  variantUploadingIndex: number | null;
  onVariantImageClick: (index: number) => void;
}

export function Variants({
  form,
  variantUploadingIndex,
  onVariantImageClick,
}: VariantsProps) {
  const { fields, append, remove } = useFieldArray({
    name: "variants",
    control: form.control,
  });

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Quản lý biến thể
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Thiết lập các phiên bản khác nhau của sản phẩm (Size, Màu sắc...)
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-lg font-bold gap-2 border-slate-200 hover:bg-slate-50"
          onClick={() => append({ size: "", color: "", price: 0, stock: 0, image: "" })}
        >
          <Plus className="h-4 w-4" /> Thêm biến thể mới
        </Button>
      </div>

      {fields.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-6 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200 items-end group relative transition-all hover:border-primary/30"
            >
              <div className="flex flex-col gap-2">
                <FormLabel className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">
                  Ảnh
                </FormLabel>
                <FormField
                  control={form.control}
                  name={`variants.${index}.image`}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <div
                        className="h-11 w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-primary/50 relative group"
                        onClick={() => onVariantImageClick(index)}
                      >
                        {variantUploadingIndex === index ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : field.value ? (
                          <img
                            key={field.value}
                            src={field.value}
                            className="h-full w-full object-cover"
                            alt="Variant"
                            onError={(e) => {
                              // Fallback if image fails to load
                              (e.target as HTMLImageElement).src = "";
                            }}
                          />
                        ) : (
                          <ImagePlus className="h-4 w-4 text-slate-300" />
                        )}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <Input
                        placeholder="Dán link ảnh..."
                        className="h-11 rounded-xl border-slate-200 bg-white text-[10px] focus:ring-primary/20"
                        {...field}
                        value={field.value || ""}
                      />
                    </div>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`variants.${index}.size`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">
                      Kích cỡ (Size)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="M, L, XL..."
                        className="h-11 rounded-xl border-slate-200 bg-white focus:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`variants.${index}.color`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">
                      Màu sắc
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Trắng, Đen..."
                        className="h-11 rounded-xl border-slate-200 bg-white focus:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`variants.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">
                      Giá riêng (VNĐ)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Theo giá gốc"
                        className="h-11 rounded-xl border-slate-200 bg-white focus:ring-primary/20"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`variants.${index}.stock`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">
                      Tồn kho
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="h-11 rounded-xl border-slate-200 bg-white font-bold text-slate-900 focus:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 text-rose-500 hover:bg-rose-50 rounded-xl"
                  onClick={() => remove(index)}
                >
                  <Trash className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-xl gap-4 text-slate-500 bg-slate-50/50">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
            <Tag className="h-8 w-8 text-slate-300" />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-900">Chưa có biến thể nào</p>
            <p className="text-xs font-medium text-slate-500 max-w-[250px] mt-1">
              Thêm các biến thể để khách hàng có nhiều sự lựa chọn hơn về kích cỡ, màu
              sắc.
            </p>
          </div>
          <Button
            type="button"
            className="rounded-lg font-bold px-6 bg-primary text-white hover:bg-slate-800 shadow-sm"
            onClick={() =>
              append({ size: "", color: "", price: 0, stock: 0, image: "" })
            }
          >
            Tạo biến thể đầu tiên
          </Button>
        </div>
      )}
    </div>
  );
}
