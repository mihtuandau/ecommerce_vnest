"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Save, ChevronLeft } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import { useProducts } from "@/features/products/hooks";

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
  applicableToProducts: z.array(z.any()).default([]),
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
        type: initialData.percentage
          ? "PERCENTAGE"
          : initialData.fixedAmount
            ? "FIXED"
            : initialData.type || "PERCENTAGE",
        value:
          initialData.percentage || initialData.fixedAmount || initialData.value || 0,
        minOrderAmount: initialData.minOrderValue || initialData.minOrderAmount || 0,
        maxDiscountAmount:
          initialData.maxDiscount || initialData.maxDiscountAmount || 0,
        usageLimit: initialData.usageLimit || 100,
        startDate: formatDateForInput(initialData.startDate),
        endDate: formatDateForInput(initialData.endDate),
        applicableToProducts: (initialData.applicableToProducts || []).map(
          (p: any) => ({
            productId: String(p.productId || p),
            stockLimit: p.stockLimit || 0,
            percentage: p.percentage || null,
            fixedAmount: p.fixedAmount || null,
            badge: p.badge || null,
          })
        ),
      });
    }
  }, [initialData, form]);

  const onFormSubmit = (values: any) => {
    const submissionValues = {
      ...values,
      percentage: values.type === "PERCENTAGE" ? Number(values.value) : null,
      fixedAmount: values.type === "FIXED" ? Number(values.value) : null,
      applicableToProducts: values.applicableToProducts.map((p: any) => ({
        productId: Number(p.productId),
        stockLimit:
          p.stockLimit !== "" && p.stockLimit !== null ? Number(p.stockLimit) : 0,
        percentage:
          p.percentage !== "" && p.percentage !== null ? Number(p.percentage) : null,
        fixedAmount:
          p.fixedAmount !== "" && p.fixedAmount !== null ? Number(p.fixedAmount) : null,
        badge: p.badge || null,
      })),
    };

    delete (submissionValues as any).type;
    delete (submissionValues as any).value;

    onSubmit(submissionValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <Tabs defaultValue="general" className="w-full">
          {/* Professional Tab Navigation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-200 pb-1 mb-8">
            <TabsList className="bg-transparent h-auto p-0 flex gap-10">
              <TabsTrigger
                value="general"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-4 text-slate-500 data-[state=active]:text-slate-900 font-bold text-[15px] transition-all"
              >
                Cấu hình & Mức giảm
              </TabsTrigger>
              <TabsTrigger
                value="rules"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-4 text-slate-500 data-[state=active]:text-slate-900 font-bold text-[15px] transition-all"
              >
                Điều kiện & Thời gian
              </TabsTrigger>
              <TabsTrigger
                value="scope"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-4 text-slate-500 data-[state=active]:text-slate-900 font-bold text-[15px] transition-all"
              >
                Sản phẩm áp dụng
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3 pb-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 px-5 rounded-xl font-bold text-xs hover:bg-slate-50"
                onClick={() => router.back()}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading}
                className="h-10 px-6 rounded-xl font-bold text-xs shadow-lg shadow-primary/10"
              >
                {isLoading ? (
                  <Spinner size="sm" className="mr-2" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Lưu thay đổi
              </Button>
            </div>
          </div>

          <div className="max-w-[1200px]">
            {/* Tab 1: General + Value */}
            <TabsContent
              value="general"
              className="mt-0 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <BasicInfoSection form={form} />
              <ValueSection form={form} />
            </TabsContent>

            {/* Tab 2: Rules (Usage) */}
            <TabsContent
              value="rules"
              className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <UsageSection form={form} />
            </TabsContent>

            {/* Tab 3: Scope */}
            <TabsContent
              value="scope"
              className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <ScopeSection
                form={form}
                products={productsData?.data || []}
                isLoading={isLoadingProducts}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </TabsContent>
          </div>
        </Tabs>
      </form>
    </Form>
  );
}
