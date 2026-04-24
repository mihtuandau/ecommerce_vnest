"use client";

import React, { use, useState, useMemo, useEffect } from "react";
import { useProductDetail } from "@/features/products/hooks";
import { useFlashSale } from "@/features/discounts/hooks";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Star, Minus, Plus, Heart, Share2, Home, ChevronRight, LayoutGrid, Sparkles, Zap, Facebook, Twitter, Mail, Link2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/hooks/useToast";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductOptions } from "@/features/products/components/customer/detail/ProductOptions";
import { ProductTabs } from "@/features/products/components/customer/detail/ProductTabs";
import { RelatedProducts } from "@/features/products/components/customer/RelatedProducts";
import { cn } from "@/utils/cn";
import { getTimeLeft } from "@/utils/formatDate";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function ProductCountdown({ endDate }: { endDate: string }) {
  const [time, setTime] = useState(() => getTimeLeft(endDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTimeLeft(endDate));
    }, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (!time || time.expired) return null;

  return (
    <div className="flex items-center gap-2">
      {[
        { val: time.days, label: "n" },
        { val: time.hours, label: "g" },
        { val: time.minutes, label: "p" },
        { val: time.seconds, label: "s" }
      ].map((item, i) => (
        <React.Fragment key={i}>
          <div className="flex items-baseline gap-0.5">
            <span className="text-sm font-semibold text-slate-900 tabular-nums">{pad(item.val)}</span>
            <span className="text-[9px] font-semibold text-slate-400 uppercase">{item.label}</span>
          </div>
          {i < 3 && <span className="text-slate-200 font-medium">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const { data: product, isLoading, error } = useProductDetail(slug);
  const { data: flashSale } = useFlashSale();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  const addItem = useCartStore((state) => state.addItem);
  const { success } = useToast();

  // Find Selected Variant
  const selectedVariant = useMemo(() => {
    if (!product?.variants) return null;
    return product.variants.find((v: any) => 
      (!selectedSize || v.size === selectedSize) && 
      (!selectedColor || v.color === selectedColor)
    );
  }, [product, selectedSize, selectedColor]);

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <Skeleton className="aspect-square rounded-[3rem]" />
          <div className="space-y-8">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-4">
               <Skeleton className="h-14 flex-1 rounded-full" />
               <Skeleton className="h-14 flex-1 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <h1 className="text-2xl font-semibold uppercase tracking-tight">Không tìm thấy sản phẩm</h1>
        <Button asChild className="rounded-full px-8" variant="outline">
          <Link href="/shop">Quay lại cửa hàng</Link>
        </Button>
      </div>
    );
  }

  // Calculate Prices based on Variant
  const isFlashSale = flashSale?.products?.some((p: any) => String(p.id) === String(product.id));
  const flashSalePercent = isFlashSale ? (flashSale.percentage || 0) : 0;
  
  const currentBasePrice = selectedVariant?.price || product.price || (product as any).basePrice || 0;
  
  const finalPrice = isFlashSale 
    ? Math.round(currentBasePrice * (1 - flashSalePercent / 100))
    : currentBasePrice;
    
  const originalPriceVal = product.originalPrice || (product as any).oldPrice;
  const finalOriginalPrice = isFlashSale 
    ? currentBasePrice 
    : originalPriceVal;

  const currentStock = selectedVariant?.stock ?? product.stock;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      imageUrl: (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url) || "/placeholder.png",
      slug: product.slug,
    });
    success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* ── Breadcrumbs ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-50">
        <div className="py-4 md:py-6">
          <nav className="flex items-center gap-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider overflow-x-auto no-scrollbar scroll-smooth">
            <Link href="/" className="hover:text-primary transition-all flex items-center gap-1.5 group whitespace-nowrap">
              <Home className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="h-3 w-3 opacity-30 shrink-0" />
            <Link href="/shop" className="hover:text-primary transition-colors whitespace-nowrap">
              Cửa hàng
            </Link>
            {product.category && (
              <>
                <ChevronRight className="h-3 w-3 opacity-30 shrink-0" />
                <Link href={`/shop?categoryId=${product.categoryId}`} className="hover:text-primary transition-colors whitespace-nowrap">
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3 opacity-30 shrink-0" />
            <span className="text-primary font-semibold whitespace-nowrap truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ── Left: Image Gallery ── */}
          <div className="lg:col-span-7">
            <div className="flex gap-4 items-start">
              {/* Vertical Thumbnails */}
              <div className="hidden md:flex flex-col gap-3 w-16 shrink-0">
                {product.images?.map((img: any, i: number) => {
                  const rawUrl = typeof img === 'string' ? img : img?.url || "";
                  const imgUrl = rawUrl?.startsWith('http') ? rawUrl : `/${rawUrl}`;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        "relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-all",
                        selectedImage === i ? "border-slate-900" : "border-transparent hover:border-slate-200"
                      )}
                    >
                      <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                    </button>
                  );
                })}
              </div>

              {/* Main Image */}
              <div className="flex-1 relative aspect-square max-h-[600px] overflow-hidden flex items-center justify-center p-0">
                <img
                  src={(typeof product.images[selectedImage] === 'string' ? product.images[selectedImage] : (product.images[selectedImage] as any)?.url || "")?.startsWith('http') 
                    ? (typeof product.images[selectedImage] === 'string' ? product.images[selectedImage] : (product.images[selectedImage] as any).url) 
                    : `/${(typeof product.images[selectedImage] === 'string' ? product.images[selectedImage] : (product.images[selectedImage] as any)?.url || "")}`}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
            
            {/* Mobile Thumbnails */}
            <div className="flex md:hidden gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images?.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative h-14 w-14 flex-shrink-0 rounded-lg border-2",
                    selectedImage === i ? "border-slate-900" : "border-transparent"
                  )}
                >
                  <img src={typeof img === 'string' ? img : img.url} alt="" className="h-full w-full object-cover rounded-md" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Product Info ── */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2.5">
              <span className="text-[10px] font-semibold text-primary/80 px-2 py-0.5 bg-blue-50 rounded">
                {product.category?.name || "Nón & Mũ"}
              </span>

              <h1 className="text-xl md:text-2xl font-semibold text-slate-900 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("h-3 w-3", i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-200")} />
                    ))}
                  </div>
                  <span className="text-slate-900 font-semibold ml-1">{product.rating || 0.0}</span>
                </div>
                <span className="h-3 w-px bg-slate-200" />
                <span>0 đánh giá</span>
                <span className="h-3 w-px bg-slate-200" />
                <span>3 đã bán</span>
                <span className="h-3 w-px bg-slate-200" />
                <span>10 lượt xem</span>
              </div>
            </div>

            {/* Flash Sale Box */}
            <div className={cn(
              "p-5 rounded-xl space-y-5",
              isFlashSale ? "bg-rose-50/50 border border-rose-100" : "bg-slate-50/50 border border-slate-100"
            )}>
              <div className="space-y-3">
                {isFlashSale && (
                  <div className="inline-flex items-center gap-1.5 bg-rose-500 text-white px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider">
                    <Zap className="h-3 w-3 fill-current" /> FLASH SALE · -{flashSalePercent}%
                  </div>
                )}

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-semibold text-rose-500 tracking-tight tabular-nums">
                    {formatCurrency(finalPrice)}
                  </span>
                  {finalOriginalPrice && finalOriginalPrice > finalPrice && (
                    <span className="text-sm text-slate-300 line-through font-medium">
                      {formatCurrency(finalOriginalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {isFlashSale && flashSale?.endDate && (
                <div className="flex items-center gap-4 pt-3 border-t border-rose-100/50">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-500/60 uppercase">
                    Kết thúc sau
                  </div>
                  <ProductCountdown endDate={flashSale.endDate} />
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-green-600">
                Còn hàng ({currentStock} sản phẩm)
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-6 py-1">
              <span className="text-xs font-medium text-slate-500 w-16">Số lượng</span>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8 flex items-center justify-center hover:bg-slate-50 border-r border-slate-200 transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-10 text-center text-xs font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="h-8 w-8 flex items-center justify-center hover:bg-slate-50 border-l border-slate-200 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <span className="text-[10px] text-slate-400">Tối đa {currentStock}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={handleAddToCart}
                className="flex-1 h-11 rounded-lg border border-primary/20 text-primary font-semibold text-xs hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" /> Thêm vào giỏ
              </button>
              <button 
                className="flex-[1.2] h-11 rounded-lg bg-primary text-white font-semibold text-xs hover:bg-[#0d47a1] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
              >
                Mua ngay
              </button>
              <button 
                className="h-11 w-11 rounded-lg border border-slate-200 hover:border-primary text-slate-400 hover:text-primary transition-all flex items-center justify-center"
              >
                <Heart className="h-4 w-4" />
              </button>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Chia sẻ</span>
              <div className="flex items-center gap-2.5">
                {[
                  { icon: Facebook, color: "hover:text-blue-600" },
                  { icon: Twitter, color: "hover:text-sky-500" },
                  { icon: Mail, color: "hover:text-rose-500" },
                  { icon: Link2, color: "hover:text-slate-900" }
                ].map((social, i) => (
                  <button key={i} className={cn("h-7 w-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-colors", social.color)}>
                    <social.icon className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-8 pt-8 border-t border-slate-50">
              <div className="text-[11px] font-medium text-slate-400">Giao hàng 2-3 ngày</div>
              <div className="text-[11px] font-medium text-slate-400">Bảo hành chính hãng</div>
              <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                Đổi trả 30 ngày
              </div>
              <div className="text-[11px] font-medium text-slate-400">Đóng gói cẩn thận</div>
            </div>
          </div>
        </div>

        {/* Details & Tabs */}
        <div className="mt-20 border-t border-slate-50 pt-16">
          <ProductTabs product={product} />
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
        </div>
      </div>
    </div>
  );
}
