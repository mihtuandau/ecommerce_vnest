"use client";

import React from "react";
import Image from "next/image";
import { PackageSearch } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";
import { Product, ProductVariant } from "@/types/models";

interface VariantSelectorProps {
  product: Product | null;
  onClose: () => void;
  onSelectVariant: (product: Product, variant: ProductVariant) => void;
}

export function VariantSelector({
  product,
  onClose,
  onSelectVariant,
}: VariantSelectorProps) {
  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-white rounded-xl border border-slate-200 overflow-hidden shrink-0 shadow-sm relative">
              {product?.images?.[0] && (
                <Image
                  src={(product.images[0] as any).url || (product.images[0] as any)}
                  alt={product.name}
                  fill
                  className="h-full w-full object-cover"
                  sizes="64px"
                />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 leading-tight">
                {product?.name}
              </DialogTitle>
              <p className="text-sm font-semibold text-primary mt-1">
                Giá cơ bản: {product && formatCurrency(product.basePrice)}
              </p>
            </div>
          </div>
        </DialogHeader>
        <div className="p-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <PackageSearch className="h-4 w-4 text-primary" /> Vui lòng chọn phân loại
            sản phẩm
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto p-1 scrollbar-thin">
            {product?.variants
              ?.filter((v: ProductVariant) => v.isActive !== false)
              .map((variant: ProductVariant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => onSelectVariant(product, variant)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all relative overflow-hidden group",
                    variant.stock > 0
                      ? "bg-white border-slate-100 hover:border-primary hover:bg-primary/5"
                      : "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors uppercase">
                    {variant.size} {variant.color && `• ${variant.color}`}
                  </span>
                  <span className="text-[11px] font-black text-primary mt-1">
                    {formatCurrency(variant.price)}
                  </span>
                  <div className="absolute bottom-1 right-2 text-[8px] font-bold text-slate-400">
                    Kho: {variant.stock}
                  </div>
                </button>
              ))}
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-500 font-bold"
          >
            Hủy bỏ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
