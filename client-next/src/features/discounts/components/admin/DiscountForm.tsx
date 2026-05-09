"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Save } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import { useProducts } from "@/features/products/hooks";
import { Product } from "@/types/models";

// Sub-components
import { BasicInfoSection, ValueSection, UsageSection, ScopeSection } from "./form";

const discountSchema = z.object({
  code: z.string().min(3, "Mã phải có ít nhất 3 ký tự").toUpperCase(),
  description: z.string().optional(),
  image: z.string().optional(),
  isFlashSale: z.boolean().default(false),
  isActive: z.boolean().default(true),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().min(1, "Vui lòng nhập giá trị giảm giá"),
  minOrderAmount: z.coerce.number().min(0).default(0),
  maxDiscountAmount: z.coerce.number().min(0).optional(),
  usageLimit: z.coerce.number().min(1).optional(),
  startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  endDate: z.string().optional(),
  applicableToProducts: z.array(z.string()).default([]),
});

export type DiscountFormValues = z.infer<typeof discountSchema>;

interface DiscountFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function DiscountForm({ initialData, onSubmit, isLoading }: DiscountFormProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    limit: 100,
  });

  const form = useForm<any>({
    resolver: zodResolver(discountSchema) as any,
    defaultValues: {
      code: "",
      description: "",
      image: "",
      isFlashSale: false,
      isActive: true,
      type: "PERCENTAGE",
      value: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 100,
      startDate: new Date().toISOString().slice(0, 16),
      endDate: "",
      applicableToProducts: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      const formatDateForInput = (date: string | Date | undefined) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().slice(0, 16);
      };

      form.reset({
        code: initialData.code || "",
        description: initialData.description || "",
        image: initialData.image || "",
        isFlashSale: !!initialData.isFlashSale,
        isActive: initialData.isActive ?? true,
        type: initialData.percentage ? "PERCENTAGE" : initialData.fixedAmount ? "FIXED" : (initialData.type || "PERCENTAGE"),
        value: initialData.percentage || initialData.fixedAmount || initialData.value || 0,
        minOrderAmount: initialData.minOrderValue || initialData.minOrderAmount || 0,
        maxDiscountAmount:
          initialData.maxDiscount || initialData.maxDiscountAmount || 0,
        usageLimit: initialData.usageLimit || 100,
        startDate: formatDateForInput(initialData.startDate),
        endDate: formatDateForInput(initialData.endDate),
        applicableToProducts: (initialData.applicableToProducts || []).map((p: any) =>
          String(p.productId || p)
        ),
      });
    }
  }, [initialData, form]);

  const onFormSubmit = (values: DiscountFormValues) => {
    onSubmit(values);
  };

  const products = Array.isArray(productsData)
    ? productsData
    : (productsData as { data?: Product[] })?.data || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <div className="flex justify-end mb-6">
          <Button
            type="submit"
            className="h-10 px-8 rounded-lg font-semibold gap-2 bg-primary text-white hover:bg-slate-800 shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner size="sm" variant="white" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {initialData ? "Lưu thay đổi" : "Kích hoạt mã"}
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-slate-100 p-1 rounded-xl border border-slate-200 mb-8">
            <TabsTrigger
              value="general"
              className="rounded-lg px-8 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-slate-500 transition-all"
            >
              Thông tin chung
            </TabsTrigger>
            <TabsTrigger
              value="usage"
              className="rounded-lg px-8 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-slate-500 transition-all"
            >
              Cấu hình & Sản phẩm
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BasicInfoSection form={form} />
              <ValueSection form={form} />
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <UsageSection form={form} />
              </div>
              <div className="lg:col-span-7">
                <ScopeSection
                  form={form}
                  products={products}
                  isLoading={isLoadingProducts}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
