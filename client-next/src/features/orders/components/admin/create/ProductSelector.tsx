"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { productsApi } from "@/features/products/api";
import { Search, Plus, ShoppingCart, Loader2, Filter, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

interface ProductSelectorProps {
  onSelect: (item: any) => void;
}

export function ProductSelector({ onSelect }: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await productsApi.getCategories();
      setCategories(res.data || res || []);
    } catch (e) { console.error(e); }
  };

  const fetchProducts = useCallback(async (query = "", catId: number | null = null) => {
    try {
      setIsLoading(true);
      const params: any = { 
        search: query, 
        limit: 50,
      };
      if (catId) params.categoryId = catId.toString();
      
      const res = await productsApi.getProducts(params);
      setProducts(res.data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchProducts(search, selectedCat);
      fetchCategories();
    }
  }, [open, selectedCat, fetchProducts]); // Re-fetch when category changes

  // Debounce search
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      fetchProducts(search, selectedCat);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline" className="gap-2 rounded-xl border-primary text-primary hover:bg-primary/5 font-bold">
          <Filter className="h-4 w-4" />
          Duyệt theo danh mục
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
        <div className="flex h-full">
          {/* Sidebar: Categories */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
            <div className="p-6">
              <h3 className="font-black text-slate-900 uppercase tracking-tighter text-sm flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" /> Danh mục
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-6 space-y-1">
              <button
                onClick={() => setSelectedCat(null)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group",
                  selectedCat === null ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-600 hover:bg-slate-200/50"
                )}
              >
                Tất cả sản phẩm
                <ChevronRight className={cn("h-4 w-4 opacity-0 group-hover:opacity-100 transition-all", selectedCat === null && "opacity-100")} />
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group",
                    selectedCat === cat.id ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-600 hover:bg-slate-200/50"
                  )}
                >
                  {cat.name}
                  <ChevronRight className={cn("h-4 w-4 opacity-0 group-hover:opacity-100 transition-all", selectedCat === cat.id && "opacity-100")} />
                </button>
              ))}
            </div>
          </div>

          {/* Main Content: Search & Grid */}
          <div className="flex-1 flex flex-col bg-white">
            <DialogHeader className="p-6 border-b border-slate-100">
              <DialogTitle className="sr-only">Duyệt sản phẩm</DialogTitle>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="Tìm tên sản phẩm, mã SKU..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 text-base focus:bg-white transition-all shadow-inner"
                  autoFocus
                />
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              {isLoading && products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="font-bold">Đang tải dữ liệu...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-10" />
                  <p className="font-black text-lg">Không tìm thấy sản phẩm</p>
                  <p className="text-sm">Thử tìm với từ khóa khác hoặc đổi danh mục</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                      <div className="p-3 border-b border-slate-50 flex items-center gap-3">
                        <div className="h-12 w-12 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                          ) : <div className="h-full w-full flex items-center justify-center font-bold text-slate-300">N/A</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-slate-900 truncate text-sm">{product.name}</h4>
                          <Badge variant="outline" className="text-[9px] h-4 bg-slate-50 border-slate-200 text-slate-500 font-bold">
                            {product.category?.name || "No Category"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50/50">
                        {product.variants?.filter((v: any) => v.isActive).map((variant: any) => (
                          <button 
                            key={variant.id} 
                            type="button"
                            className={cn(
                              "flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 bg-white hover:border-primary hover:bg-primary/5 transition-all group/item relative overflow-hidden",
                              variant.stock <= 0 && "opacity-50 grayscale cursor-not-allowed bg-slate-100"
                            )}
                            onClick={() => {
                              if (variant.stock <= 0) return;
                              onSelect({
                                variantId: variant.id,
                                quantity: 1,
                                productName: `${product.name} (${variant.size}${variant.color ? ` - ${variant.color}` : ""})`,
                                price: variant.price,
                                image: variant.images?.[0]?.url || product.images?.[0]?.url,
                              });
                              toast.success(`Đã thêm ${variant.size} ${variant.color || ""}`);
                            }}
                          >
                            <span className="text-[10px] font-black text-slate-900 uppercase leading-none mb-1 text-center">
                              {variant.size} {variant.color && `• ${variant.color}`}
                            </span>
                            <span className="text-[10px] font-bold text-primary">
                              {formatCurrency(variant.price)}
                            </span>
                            <div className="absolute bottom-0 right-0 bg-slate-100 px-1 text-[8px] font-bold text-slate-400 rounded-tl-md">
                              {variant.stock}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
