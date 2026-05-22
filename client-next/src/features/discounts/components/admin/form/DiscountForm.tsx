"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { Spinner } from "@/components/ui/Spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useProducts } from "@/features/products/hooks";
import { discountSchema } from "@/features/discounts/schemas";
import {
  mapDiscountFormToPayload,
  mapDiscountToFormValues,
} from "@/features/discounts/services";
import { BasicInfoSection } from "./BasicInfoSection";
import { ScopeSection } from "./ScopeSection";
import { UsageSection } from "./UsageSection";
import { ValueSection } from "./ValueSection";

interface DiscountFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const tabClass =
  "rounded-none border-b-2 border-transparent data-[state=active]:border-teal-700 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-4 text-slate-500 data-[state=active]:text-teal-800 font-medium text-sm transition-all";

export function DiscountForm({
  initialData,
  onSubmit,
  isLoading,
}: DiscountFormProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
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
      form.reset(mapDiscountToFormValues(initialData));
    }
  }, [initialData, form]);

  const onFormSubmit = (values: any) => {
    onSubmit(mapDiscountFormToPayload(values));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-200 pb-1 mb-6">
            <TabsList className="bg-transparent h-auto p-0 flex gap-6">
              <TabsTrigger value="general" className={tabClass}>
                Cấu hình & mức giảm
              </TabsTrigger>
              <TabsTrigger value="rules" className={tabClass}>
                Điều kiện & thời gian
              </TabsTrigger>
              <TabsTrigger value="scope" className={tabClass}>
                Sản phẩm áp dụng
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3 pb-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 px-5 rounded-xl font-medium text-sm hover:bg-slate-50"
                onClick={() => router.back()}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading}
                className="h-10 px-6 rounded-xl bg-teal-700 text-white hover:bg-teal-800 font-medium text-sm shadow-sm"
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

          <TabsContent
            value="general"
            className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <BasicInfoSection form={form} />
            <ValueSection form={form} />
          </TabsContent>

          <TabsContent
            value="rules"
            className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <UsageSection form={form} />
          </TabsContent>

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
        </Tabs>
      </form>
    </Form>
  );
}
