"use client";

import { useMemo } from "react";
import { Ruler } from "lucide-react";
import { cn } from "@/utils/cn";

import { Product, ProductVariant } from "@/types/models";

interface ProductOptionsProps {
  product: Product;
  selectedSize: string | null;
  selectedColor: string | null;
  onSizeSelect: (size: string) => void;
  onColorSelect: (color: string) => void;
}

export function ProductOptions({
  product,
  selectedSize,
  selectedColor,
  onSizeSelect,
  onColorSelect,
}: ProductOptionsProps) {
  const sizes = useMemo(() => {
    if (!product?.variants) return [];
    return [...new Set(product.variants?.map((v: ProductVariant) => v.size).filter(Boolean) as string[])];
  }, [product?.variants]);

  const colors = useMemo(() => {
    if (!product?.variants) return [];
    return [...new Set(product.variants?.map((v: ProductVariant) => v.color).filter(Boolean) as string[])];
  }, [product?.variants]);

  const availableSizes = useMemo(() => {
    if (!selectedColor || !product?.variants) return sizes;
    return sizes.filter((size) =>
      product.variants.some(
        (v: ProductVariant) => v.size === size && v.color === selectedColor && (v.stock || 0) > 0
      )
    );
  }, [selectedColor, product?.variants, sizes]);

  const availableColors = useMemo(() => {
    if (!selectedSize || !product?.variants) return colors;
    return colors.filter((color) =>
      product.variants.some(
        (v: ProductVariant) => v.color === color && v.size === selectedSize && (v.stock || 0) > 0
      )
    );
  }, [selectedSize, product?.variants, colors]);

  if (sizes.length === 0 && colors.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Sizes */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Kích thước
              </span>
              {selectedSize && (
                <span className="text-xs font-bold text-slate-900">
                  · {selectedSize}
                </span>
              )}
            </div>
            <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary hover:opacity-70 transition-opacity">
              <Ruler size={12} /> Hướng dẫn chọn size
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size: string) => {
              const isActive = selectedSize === size;
              const isAvailable = availableSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => onSizeSelect(size)}
                  disabled={!isAvailable}
                  className={cn(
                    "h-10 min-w-[50px] px-3 rounded-lg text-xs font-bold border transition-all duration-300",
                    isActive
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/10"
                      : isAvailable
                        ? "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary"
                        : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through opacity-50"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Màu sắc
            </span>
            {selectedColor && (
              <span className="text-xs font-bold text-slate-900">
                · {selectedColor}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color: string) => {
              const isActive = selectedColor === color;
              const isAvailable = availableColors.includes(color);

              return (
                <button
                  key={color}
                  onClick={() => onColorSelect(color)}
                  disabled={!isAvailable}
                  className={cn(
                    "group relative flex items-center gap-2.5 h-10 px-4 rounded-lg border transition-all duration-300",
                    isActive
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/10"
                      : isAvailable
                        ? "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary"
                        : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-40"
                  )}
                >
                  <span className="text-[11px] font-bold">{color}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
