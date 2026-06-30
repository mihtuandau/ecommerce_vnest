"use client";

import { useMemo } from "react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Package, Search, Check } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";
import { Product } from "@/types/models";

interface ScopeSectionProps {
  form: UseFormReturn<any>;
  products: Product[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export function ScopeSection({
  form,
  products,
  isLoading,
  searchQuery,
  setSearchQuery,
}: ScopeSectionProps) {
  const selectedProducts = form.watch("applicableToProducts") || [];

  const filteredProducts = useMemo(() => {
    const prods = Array.isArray(products) ? products : [];
    if (!searchQuery) return prods;
    return prods.filter((p: Product) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const getImageUrlForProduct = (p: Product) => {
    const firstImg = p.images?.[0];
    if (typeof firstImg === "string") return firstImg;
    if (firstImg?.url) return firstImg.url;

    const firstVariantImg = p.variants?.[0]?.images?.[0];
    if (typeof firstVariantImg === "string") return firstVariantImg;
    if (firstVariantImg?.url) return firstVariantImg.url;

    return "/placeholder.png";
  };

  const toggleProduct = (productId: string) => {
    const current = [...selectedProducts];
    const index = current.findIndex((p: any) => p.productId === productId);

    if (index !== -1) {
      form.setValue(
        "applicableToProducts",
        current.filter((p: any) => p.productId !== productId)
      );
      return;
    }

    form.setValue("applicableToProducts", [
      ...current,
      {
        productId,
        stockLimit: 0,
        percentage: null,
        fixedAmount: null,
        badge: null,
      },
    ]);
  };

  const updateProductMetadata = (productId: string, field: string, value: any) => {
    const current = [...selectedProducts];
    const index = current.findIndex((p: any) => p.productId === productId);
    if (index !== -1) {
      current[index] = { ...current[index], [field]: value };
      form.setValue("applicableToProducts", current);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-teal-600" />
          <h3 className="text-base font-semibold text-slate-800">
            Sản phẩm áp dụng
          </h3>
        </div>
        <Badge
          variant="secondary"
          className="rounded-lg px-2 py-1 text-xs font-medium"
        >
          Đã chọn: {selectedProducts.length}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Tìm sản phẩm..."
            className="h-11 rounded-xl border-slate-200 pl-9 focus:border-teal-500 focus:ring-teal-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-100">
          <div className="max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2 p-8 text-center">
                <Spinner size="sm" />
                <p className="text-xs font-medium text-slate-500">Đang tải...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-xs font-medium text-slate-500">
                Không tìm thấy sản phẩm nào
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filteredProducts.map((product: Product) => {
                  const selection = selectedProducts.find(
                    (p: any) => p.productId === String(product.id)
                  );
                  const isSelected = !!selection;

                  return (
                    <div
                      key={product.id}
                      className={cn("transition-all", isSelected && "bg-slate-50/50")}
                    >
                      <div
                        className={cn(
                          "group flex cursor-pointer items-center gap-4 p-3 transition-colors hover:bg-slate-50",
                          isSelected && "border-b border-slate-100"
                        )}
                        onClick={() => toggleProduct(String(product.id))}
                      >
                        <div
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded border transition-all",
                            isSelected
                              ? "border-teal-600 bg-teal-600"
                              : "border-slate-200 group-hover:border-teal-500"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>

                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-white">
                          <Image
                            src={getImageUrlForProduct(product)}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {product.name}
                          </p>
                          <p className="mt-0.5 text-xs font-medium text-slate-500">
                            ID: #{product.id} • {formatCurrency(product.basePrice)}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 bg-white/50 px-12 py-4 lg:grid-cols-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500">
                              Giới hạn (Flash)
                            </label>
                            <Input
                              type="number"
                              placeholder="Vô hạn"
                              className="h-9 rounded-lg border-slate-200 text-xs font-medium text-slate-800"
                              value={selection.stockLimit ?? ""}
                              onChange={(e) =>
                                updateProductMetadata(
                                  String(product.id),
                                  "stockLimit",
                                  e.target.value !== "" ? Number(e.target.value) : 0
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500">
                              % giảm (ghi đè)
                            </label>
                            <Input
                              type="number"
                              placeholder="Mặc định"
                              className="h-9 rounded-lg border-slate-200 text-xs font-medium text-slate-800"
                              value={selection.percentage ?? ""}
                              onChange={(e) =>
                                updateProductMetadata(
                                  String(product.id),
                                  "percentage",
                                  e.target.value !== "" ? Number(e.target.value) : null
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500">
                              Tiền giảm (ghi đè)
                            </label>
                            <Input
                              type="number"
                              placeholder="Mặc định"
                              className="h-9 rounded-lg border-slate-200 text-xs font-medium text-slate-800"
                              value={selection.fixedAmount ?? ""}
                              onChange={(e) =>
                                updateProductMetadata(
                                  String(product.id),
                                  "fixedAmount",
                                  e.target.value !== "" ? Number(e.target.value) : null
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500">
                              Badge (nhãn)
                            </label>
                            <Input
                              placeholder="VD: HOT"
                              className="h-9 rounded-lg border-slate-200 text-xs font-medium text-slate-800"
                              value={selection.badge || ""}
                              onChange={(e) =>
                                updateProductMetadata(
                                  String(product.id),
                                  "badge",
                                  e.target.value
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
