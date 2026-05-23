"use client";

import Image from "next/image";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Tag, Plus, Trash, ImagePlus } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import type { ProductFormValues } from "../../../schemas";

interface VariantsProps {
  form: UseFormReturn<ProductFormValues>;
  variantUploadingIndex: number | null;
  onVariantImageClick: (index: number) => void;
}

const fieldInputClass =
  "h-11 rounded-xl border-slate-200 bg-white text-sm font-medium text-slate-800 focus:border-teal-500 focus:ring-4 focus:ring-teal-100/60 transition-all duration-200";

const fieldLabelClass = "block text-xs font-medium text-slate-500";

export function Variants({
  form,
  variantUploadingIndex,
  onVariantImageClick,
}: VariantsProps) {
  const { fields, append, remove } = useFieldArray({
    name: "variants",
    control: form.control,
  });

  const addVariant = () =>
    append({
      size: "",
      color: "",
      price: 0,
      originalPrice: 0,
      stock: 0,
      image: "",
    });

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/30 px-6 py-4">
        <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800">
          <Tag className="h-4 w-4 text-slate-500" />
          Quản lý biến thể
        </h3>
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-lg border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          onClick={addVariant}
        >
          <Plus className="h-4 w-4 text-slate-500" />
          Thêm biến thể mới
        </Button>
      </div>

      <div className="space-y-6 p-6">
        <p className="-mt-2 text-xs font-medium text-slate-500">
          Thiết lập các phiên bản khác nhau của sản phẩm (size, màu sắc...).
        </p>

        {fields.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="group relative grid grid-cols-1 items-end gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-teal-300 md:grid-cols-12"
              >
                <div className="flex flex-col items-center gap-2 md:col-span-1">
                  <FormLabel className="block text-center text-xs font-medium text-slate-500">
                    Ảnh
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name={`variants.${index}.image`}
                    render={({ field }) => (
                      <div
                        className="relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-teal-500"
                        onClick={() => onVariantImageClick(index)}
                      >
                        {variantUploadingIndex === index ? (
                          <Spinner size="sm" />
                        ) : field.value ? (
                          <Image
                            key={field.value}
                            src={field.value}
                            fill
                            className="object-cover"
                            alt="Variant"
                          />
                        ) : (
                          <ImagePlus className="h-4 w-4 text-slate-300" />
                        )}
                        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity hover:opacity-100" />
                      </div>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`variants.${index}.size`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={fieldLabelClass}>Size</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="M, L, XL..."
                          className={fieldInputClass}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`variants.${index}.color`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={fieldLabelClass}>Màu sắc</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Trắng, đen..."
                          className={fieldInputClass}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`variants.${index}.price`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={fieldLabelClass}>Giá bán</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Giá bán"
                          className={fieldInputClass}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`variants.${index}.originalPrice`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={fieldLabelClass}>Giá gốc</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Giá niêm yết"
                          className={fieldInputClass}
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
                    <FormItem className="md:col-span-2">
                      <FormLabel className={fieldLabelClass}>Tồn kho</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className={fieldInputClass}
                          {...field}
                          value={field.value ?? 0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-center md:col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-xl text-rose-500 hover:bg-rose-50"
                    onClick={() => remove(index)}
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-20 text-slate-500">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Tag className="h-8 w-8 text-slate-300" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-900">Chưa có biến thể nào</p>
              <p className="mt-1 max-w-[250px] text-xs font-medium text-slate-500">
                Thêm các biến thể để khách hàng có nhiều lựa chọn hơn về kích cỡ,
                màu sắc.
              </p>
            </div>
            <Button
              type="button"
              className="h-10 rounded-lg bg-teal-600 px-6 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
              onClick={addVariant}
            >
              Tạo biến thể đầu tiên
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
