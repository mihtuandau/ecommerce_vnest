"use client";

import React from "react";
import { Search, Scan } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";
import { Category, Product } from "@/types/models";

interface ProductBrowserProps {
  categories: Category[];
  products: Product[];
  selectedCat: number | null;
  onSelectCat: (id: number | null) => void;
  search: string;
  onSearchChange: (val: string) => void;
  isLoading: boolean;
  onProductClick: (product: Product) => void;
}

export function ProductBrowser({
  categories,
  products,
  selectedCat,
  onSelectCat,
  search,
  onSearchChange,
  isLoading,
  onProductClick,
}: ProductBrowserProps) {
  return (
    <div className="flex-1 flex flex-col bg-slate-50/50">
      
      <div className="p-5 border-b border-slate-100 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm tên hoặc mã sản phẩm..."
              className="h-10 pl-9 bg-white border-slate-200 rounded-lg text-sm shadow-none"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-10 px-4 border-slate-200 rounded-lg gap-2 text-slate-600 text-xs font-semibold"
          >
            <Scan className="h-4 w-4" /> QUÉT MÃ
          </Button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => onSelectCat(null)}
            className={cn(
              "px-4 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 uppercase",
              selectedCat === null
                ? "bg-primary text-white"
                : "bg-white text-slate-500 border border-slate-200"
            )}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCat(cat.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 uppercase",
                selectedCat === cat.id
                  ? "bg-primary text-white"
                  : "bg-white text-slate-500 border border-slate-200"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      
      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => onProductClick(product)}
                className="bg-white border border-slate-100 rounded-xl overflow-hidden flex flex-col hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="aspect-square bg-slate-50 overflow-hidden relative border-b border-slate-50">
                  {(product.images?.[0] as any)?.url ? (
                    <Image
                      src={(product.images[0] as any).url}
                      alt={product.name}
                      fill
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      sizes="200px"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-200">
                      NO IMAGE
                    </div>
                  )}

                  {product.variants && product.variants.length > 1 && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary/90 text-[8px] h-4 px-1.5">
                        {product.variants.length} loại
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h4 className="text-[11px] font-semibold text-slate-700 line-clamp-2 leading-tight mb-1">
                    {product.name}
                  </h4>
                  <div className="mt-auto">
                    <p className="text-primary font-bold text-xs">
                      {formatCurrency(product.basePrice)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
