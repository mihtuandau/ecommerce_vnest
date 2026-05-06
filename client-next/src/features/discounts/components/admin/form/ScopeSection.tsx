"use client";

import React, { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  FormItem, 
  FormLabel, 
  FormControl 
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Package, Search, Loader2, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";
import { Product } from "@/types/models";

import { DiscountFormValues } from "../DiscountForm";

interface ScopeSectionProps {
  form: UseFormReturn<DiscountFormValues>;
  products: Product[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ScopeSection({ 
  form, 
  products, 
  isLoading, 
  searchQuery, 
  onSearchChange 
}: ScopeSectionProps) {
  const selectedProducts = form.watch("applicableToProducts") || [];

  const filteredProducts = useMemo(() => {
    const prods = Array.isArray(products) ? products : [];
    if (!searchQuery) return prods;
    return prods.filter((p: Product) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const toggleProduct = (productId: number) => {
    const current = [...selectedProducts];
    if (current.includes(productId)) {
      form.setValue(
        "applicableToProducts",
        current.filter((id) => id !== productId)
      );
    } else {
      form.setValue("applicableToProducts", [...current, productId]);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between pb-2 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-base text-slate-800">Sản phẩm áp dụng</h3>
        </div>
        <Badge variant="secondary" className="rounded-lg font-semibold text-xs px-2 py-1">
          Đã chọn: {selectedProducts.length}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm sản phẩm..."
            className="pl-9 h-11 rounded-xl border-slate-200 focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs font-semibold text-slate-500">Đang tải...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-semibold italic">
                Không tìm thấy sản phẩm nào
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filteredProducts.map((product: Product) => {
                  const isSelected = selectedProducts.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      className={cn(
                        "p-3 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors group",
                        isSelected && "bg-slate-50"
                      )}
                      onClick={() => toggleProduct(product.id)}
                    >
                      <div className={cn(
                        "h-5 w-5 rounded border flex items-center justify-center transition-all",
                        isSelected 
                          ? "bg-primary border-primary" 
                          : "border-slate-200 group-hover:border-primary/50"
                      )}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>

                      <div className="h-10 w-10 rounded-lg bg-white overflow-hidden border border-slate-100 shrink-0">
                        <img
                          src={
                            product.images?.[0]?.url ||
                            product.variants?.[0]?.images?.[0]?.url ||
                            "/placeholder.png"
                          }
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          ID: #{product.id}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-slate-900">
                          {formatCurrency(product.basePrice)}
                        </p>
                      </div>
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
