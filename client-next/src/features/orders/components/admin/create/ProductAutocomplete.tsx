"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { productsApi } from "@/features/products/api";
import { Search, Plus, ShoppingCart } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";

interface ProductAutocompleteProps {
  onSelect: (item: any) => void;
}

export function ProductAutocomplete({ onSelect }: ProductAutocompleteProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (search.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await productsApi.getProducts({ search, limit: 10 });
        setResults(res.data || []);
        setIsOpen(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSelect = (product: any, variant: any) => {
    onSelect({
      variantId: variant.id,
      quantity: 1,
      productName: `${product.name} (${variant.size}${variant.color ? ` - ${variant.color}` : ""})`,
      price: variant.price,
      image: variant.images?.[0]?.url || product.images?.[0]?.url,
    });
    setSearch("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
        <Input
          placeholder="Gõ tên sản phẩm hoặc mã để thêm nhanh..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => search.length >= 2 && setIsOpen(true)}
          className="pl-12 h-14 rounded-2xl border-primary/20 bg-primary/5 focus:bg-white focus:ring-primary/20 transition-all text-base font-medium"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Spinner size="sm" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[100] max-h-[400px] overflow-y-auto p-2 scrollbar-thin">
          {results.map((product) => (
            <div key={product.id} className="mb-2 last:mb-0">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase  border-b border-slate-50 mb-1 flex items-center justify-between">
                {product.name}
                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                  {product.category?.name}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-50/50 rounded-xl">
                {product.variants
                  ?.filter((v: any) => v.isActive)
                  .map((variant: any) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => handleSelect(product, variant)}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all group/item"
                    >
                      <span className="text-[10px] font-black text-slate-900 uppercase leading-none mb-1">
                        {variant.size} {variant.color && `• ${variant.color}`}
                      </span>
                      <span className="text-[10px] font-semibold text-primary">
                        {formatCurrency(variant.price)}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && search.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-8 text-center text-slate-400">
          <p className="font-semibold">Không tìm thấy sản phẩm nào</p>
          <p className="text-xs">Thử tìm với từ khóa khác</p>
        </div>
      )}
    </div>
  );
}
