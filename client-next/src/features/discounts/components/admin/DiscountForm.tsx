"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Ticket, Percent, Banknote, Calendar, Zap, Loader2, Save, Search, Package } from "lucide-react";
import { cn } from "@/utils/cn";
import { useProducts } from "@/features/products/hooks";
import { Badge } from "@/components/ui/Badge";

const discountSchema = z
  .object({
    code: z.string().min(3, "Mã phải có ít nhất 3 ký tự").toUpperCase(),
    description: z.string().optional(),
    isFlashSale: z.boolean().default(false),
    isActive: z.boolean().default(true),
    type: z.enum(["PERCENTAGE", "FIXED"]),
    percentage: z.coerce.number().min(0).max(100).optional(),
    fixedAmount: z.coerce.number().min(0).optional(),
    minOrderAmount: z.coerce.number().min(0).default(0),
    maxDiscountAmount: z.coerce.number().min(0).optional(),
    usageLimit: z.coerce.number().min(1).optional(),
    startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
    endDate: z.string().optional(),
    applicableToProducts: z.array(z.number()).default([]),
  })
  .refine(
    (data) => {
      if (data.type === "PERCENTAGE" && !data.percentage) return false;
      if (data.type === "FIXED" && !data.fixedAmount) return false;
      return true;
    },
    {
      message: "Vui lòng nhập giá trị giảm giá",
      path: ["percentage"],
    }
  );

type DiscountFormValues = z.infer<typeof discountSchema>;

interface DiscountFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function DiscountForm({ initialData, onSubmit, isLoading }: DiscountFormProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ limit: 100 });

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: "",
      description: "",
      isFlashSale: false,
      isActive: true,
      type: "PERCENTAGE",
      percentage: 0,
      fixedAmount: 0,
      minOrderAmount: 0,
      usageLimit: 100,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      applicableToProducts: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        code: initialData.code || "",
        description: initialData.description || "",
        isFlashSale: !!initialData.isFlashSale,
        isActive: initialData.isActive ?? true,
        type: initialData.percentage ? "PERCENTAGE" : "FIXED",
        percentage: initialData.percentage || 0,
        fixedAmount: initialData.fixedAmount || 0,
        minOrderAmount: initialData.minOrderAmount || 0,
        maxDiscountAmount: initialData.maxDiscountAmount || 0,
        usageLimit: initialData.usageLimit || 100,
        startDate: initialData.startDate
          ? new Date(initialData.startDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        endDate: initialData.endDate
          ? new Date(initialData.endDate).toISOString().split("T")[0]
          : "",
        applicableToProducts: initialData.applicableToProducts?.map((p: any) => p.productId || p) || [],
      });
    }
  }, [initialData, form]);

  const type = form.watch("type");
  const selectedProducts = form.watch("applicableToProducts");

  const filteredProducts = React.useMemo(() => {
    const products = Array.isArray(productsData) ? productsData : (productsData as any)?.data || [];
    if (!searchQuery) return products;
    return products.filter((p: any) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [productsData, searchQuery]);

  const toggleProduct = (productId: number) => {
    const current = form.getValues("applicableToProducts");
    if (current.includes(productId)) {
      form.setValue("applicableToProducts", current.filter(id => id !== productId));
    } else {
      form.setValue("applicableToProducts", [...current, productId]);
    }
  };

  const onFormSubmit = (values: DiscountFormValues) => {
    const submitData = { ...values };
    if (values.type === "PERCENTAGE") {
      delete submitData.fixedAmount;
    } else {
      delete submitData.percentage;
    }
    delete (submitData as any).type;
    onSubmit(submitData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-7">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <Ticket className="h-5 w-5 text-slate-400" />
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Thông tin chương trình
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-slate-500 tracking-wider">Mã giảm giá</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: SUMMER2024"
                          {...field}
                          className="h-11 rounded-xl border-slate-200 font-mono font-bold uppercase text-slate-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-slate-500 tracking-wider">Mô tả</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tên chương trình khuyến mãi"
                          {...field}
                          className="h-11 rounded-xl border-slate-200 text-slate-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-slate-500 tracking-wider">Loại ưu đãi</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-slate-200 text-slate-900 font-bold">
                            <SelectValue placeholder="Chọn loại ưu đãi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="PERCENTAGE" className="font-bold">Phần trăm (%)</SelectItem>
                          <SelectItem value="FIXED" className="font-bold">Số tiền cố định (VND)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {type === "PERCENTAGE" ? (
                  <FormField
                    control={form.control}
                    name="percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold text-slate-500 tracking-wider">
                          Phần trăm giảm
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              {...field}
                              className="h-12 rounded-xl border-slate-200 pl-10 font-bold"
                            />
                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="fixedAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold text-slate-500 tracking-wider">
                          Số tiền giảm
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              {...field}
                              className="h-12 rounded-xl border-slate-200 pl-10 font-bold"
                            />
                            <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-7">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <Calendar className="h-5 w-5 text-slate-400" />
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Thời gian & Giới hạn
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-slate-500 tracking-wider">Ngày bắt đầu</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="h-11 rounded-xl border-slate-200 text-slate-900 font-bold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-slate-500 tracking-wider">Ngày kết thúc</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="h-11 rounded-xl border-slate-200 text-slate-900 font-bold"
                        />
                      </FormControl>
                      <FormDescription className="text-[10px] font-medium text-slate-400 mt-1">
                        Để trống nếu không hết hạn
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <FormField
                  control={form.control}
                  name="minOrderAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-slate-500 tracking-wider">Đơn tối thiểu</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="h-11 rounded-xl border-slate-200 text-slate-900 font-bold"
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
                      <FormLabel className="text-[11px] font-bold text-slate-500 tracking-wider">Giảm tối đa</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="h-11 rounded-xl border-slate-200 text-slate-900 font-bold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="usageLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-slate-500 tracking-wider">Tổng lượt dùng</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="h-11 rounded-xl border-slate-200 text-slate-900 font-bold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Product Selection Card */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-7">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-slate-400" />
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">Sản phẩm áp dụng</h2>
                </div>
                <Badge className="bg-slate-900 text-white font-bold text-[10px] px-3 py-1 rounded-lg">
                  Đã chọn {selectedProducts.length}
                </Badge>
              </div>

              <div className="space-y-5">
                <div className="relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  <Input 
                    placeholder="Tìm nhanh sản phẩm theo tên..." 
                    className="pl-10 h-11 rounded-xl border-slate-200 bg-slate-50/20 focus:bg-white transition-all font-medium text-slate-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="border border-slate-100 rounded-xl overflow-hidden shadow-inner">
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-white">
                    {isLoadingProducts ? (
                      <div className="p-10 text-center flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                        <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Đang tải...</p>
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="p-10 text-center text-slate-400 font-medium text-xs">Không tìm thấy sản phẩm.</div>
                    ) : (
                      <div className="divide-y divide-slate-50">
                        {filteredProducts.map((product: any) => (
                          <div 
                            key={product.id} 
                            className={cn(
                              "p-4 flex items-center gap-5 cursor-pointer hover:bg-slate-50 transition-all group",
                              selectedProducts.includes(product.id) && "bg-slate-50/50"
                            )}
                            onClick={() => toggleProduct(product.id)}
                          >
                            <div className={cn(
                              "relative flex items-center justify-center h-5 w-5 rounded border-2 transition-all",
                              selectedProducts.includes(product.id) ? "bg-slate-900 border-slate-900 shadow-sm" : "border-slate-200 group-hover:border-slate-400"
                            )}>
                              {selectedProducts.includes(product.id) && (
                                <div className="h-2 w-2 bg-white rounded-sm" />
                              )}
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 shrink-0">
                               <img 
                                src={product.images?.[0]?.url || product.variants?.[0]?.images?.[0]?.url || "/placeholder.png"} 
                                alt={product.name} 
                                className="h-full w-full object-cover transition-all"
                               />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate mb-0.5">{product.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: #{product.id}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[14px] font-black text-slate-900">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.basePrice)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings */}
          <div className="space-y-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-7">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <Zap className="h-5 w-5 text-slate-400" />
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Thiết lập nâng cao
                </h2>
              </div>

              <FormField
                control={form.control}
                name="isFlashSale"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-xl border border-slate-100 p-4 bg-slate-50/30">
                    <div className="space-y-0.5">
                      <FormLabel className="text-xs font-bold text-slate-900">
                        Flash Sale
                      </FormLabel>
                      <FormDescription className="text-[10px]">
                        Áp dụng tự động cho sản phẩm
                      </FormDescription>
                    </div>
                    <FormControl>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                      </label>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-xl border border-slate-100 p-4 bg-slate-50/30">
                    <div className="space-y-0.5">
                      <FormLabel className="text-xs font-bold text-slate-900">
                        Trạng thái kích hoạt
                      </FormLabel>
                      <FormDescription className="text-[10px]">
                        Cho phép khách hàng sử dụng mã
                      </FormDescription>
                    </div>
                    <FormControl>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                      </label>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-13 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold gap-2 shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  {initialData ? "Lưu thay đổi" : "Tạo chương trình"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
