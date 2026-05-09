"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Form, 
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ordersApi } from "@/features/orders/api";
import { productsApi } from "@/features/products/api";
import { toast } from "sonner";
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  X, 
  Scan, 
  User, 
  Ticket, 
  Wallet, 
  QrCode, 
  CreditCard,
  Trash2,
  PackageSearch
} from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Category, Product, ProductVariant, Discount } from "@/types/models";

const orderFormSchema = z.object({
  userId: z.number().optional(),
  guestEmail: z.string().optional(),
  guestPhone: z.string().optional(),
  shippingAddress: z.string().default("Mua tại quầy"),
  paymentMethod: z.string().default("CASH"),
  status: z.string().default("DELIVERED"),
  shippingFee: z.number().default(0),
  discountCode: z.string().optional(),
  items: z.array(z.object({
    variantId: z.string(),
    quantity: z.number().min(1),
    productName: z.string(),
    price: z.number(),
    image: z.string().optional(),
    stock: z.number().optional(),
  })).min(1, "Vui lòng chọn ít nhất 1 sản phẩm"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export function AdminOrderForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);
  
  // State for quick variant selection
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  useEffect(() => {
    setOrderId(Math.floor(1000 + Math.random() * 9000));
    const init = async () => {
      try {
        const catRes = await productsApi.getCategories();
        setCategories(catRes.data || catRes || []);
        fetchProducts("", null);
      } catch (e) { console.error(e); }
    };
    init();
  }, []);

  const fetchProducts = useCallback(async (q: string, catId: number | null) => {
    try {
      setIsLoading(true);
      const params: Record<string, string | number> = { search: q, limit: 40 };
      if (catId) params.categoryId = catId.toString();
      const res = await productsApi.getProducts(params);
      setProducts(res.data || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(search, selectedCat);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, selectedCat, fetchProducts]);

  const handleProductClick = (product: Product) => {
    const activeVariants = product.variants?.filter((v: ProductVariant) => v.isActive) || [];
    
    if (activeVariants.length === 0) {
      toast.error("Sản phẩm hiện không có biến thể nào khả dụng");
      return;
    }

    if (activeVariants.length === 1) {
      addVariantToCart(product, activeVariants[0]);
    } else {
      setActiveProduct(product);
    }
  };

  const addVariantToCart = (product: Product, variant: ProductVariant) => {
    if (variant.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }
    const currentItems = form.getValues("items") || [];
    const existingIndex = currentItems.findIndex((i: any) => i.variantId === variant.id);
    const variantLabel = [variant.size, variant.color].filter(Boolean).join(" • ") || "Mặc định";
    const productName = `${product.name} (${variantLabel})`;

    if (existingIndex > -1) {
      form.setValue(`items.${existingIndex}.quantity`, currentItems[existingIndex].quantity + 1);
    } else {
      form.setValue("items", [
        ...currentItems,
        {
          variantId: String(variant.id),
          quantity: 1,
          productName,
          price: variant.price,
          image: (variant.images?.[0] as any)?.url || (product.images?.[0] as any)?.url,
          stock: variant.stock
        }
      ]);
    }
    setActiveProduct(null);
    toast.success(`Đã thêm ${product.name}`);
  };

  const updateQuantity = (index: number, delta: number) => {
    const current = form.getValues(`items.${index}.quantity`);
    const stock = form.getValues(`items.${index}.stock`) || 999;
    const next = current + delta;
    if (next >= 1 && next <= stock) form.setValue(`items.${index}.quantity`, next);
  };

  const calculateSubtotal = () => items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

  const handleValidateDiscount = async () => {
    const code = form.getValues("discountCode");
    if (!code) {
      setAppliedDiscount(null);
      return;
    }

    try {
      setIsValidatingDiscount(true);
      const res = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/discounts/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })).json();

      if (res.statusCode >= 400 || res.isValid === false) {
        toast.error(res.message || "Mã không hợp lệ");
        setAppliedDiscount(null);
      } else {
        // Store the nested discount object
        setAppliedDiscount(res.discount);
        toast.success(`Đã áp dụng mã: ${res.discount.code}`);
      }
    } catch (err) {
      toast.error("Không thể kiểm tra mã giảm giá");
    } finally {
      setIsValidatingDiscount(false);
    }
  };

  const calculateDiscountAmount = () => {
    if (!appliedDiscount) return 0;
    const subtotal = calculateSubtotal();
    
    const minOrder = Number(appliedDiscount.minOrderAmount || appliedDiscount.minOrderValue || 0);
    const maxDiscount = Number(appliedDiscount.maxDiscountAmount || appliedDiscount.maxDiscount || 0);
    const discountVal = Number(appliedDiscount.discountValue || appliedDiscount.value || 0);

    if (minOrder && subtotal < minOrder) {
      return 0;
    }

    let amount = 0;
    if (appliedDiscount.discountType === 'PERCENTAGE' || appliedDiscount.type === 'PERCENTAGE') {
      amount = Math.round((subtotal * discountVal) / 100);
    } else {
      amount = discountVal;
    }

    if (maxDiscount && amount > maxDiscount) {
      amount = maxDiscount;
    }

    return Math.min(amount, subtotal);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscountAmount();
    return subtotal - discount;
  };

  const form = useForm<any>({
    resolver: zodResolver(orderFormSchema) as any,
    defaultValues: {
      paymentMethod: "CASH",
      status: "DELIVERED",
      shippingFee: 0,
      items: [],
      shippingAddress: "Mua tại quầy",
    },
  });

  const items = form.watch("items");
  const paymentMethod = form.watch("paymentMethod");

  const onSubmit = async (values: OrderFormValues) => {
    try {
      setIsSubmitting(true);
      
      const cleanItems = (values.items || []).map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price
      }));

      const payload = {
        ...values,
        items: cleanItems
      };

      const res = await ordersApi.createAdminOrder(payload as any);
      toast.success("Tạo đơn hàng thành công");
      router.push(`/admin/orders/${res.id || res.orderCode}`);
    } catch (error: { response?: { data?: { message?: string } } } | unknown) {
      toast.error((error as any).response?.data?.message || "Lỗi khi tạo đơn hàng");
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = calculateSubtotal();
  const discountAmount = calculateDiscountAmount();
  const total = calculateTotal();

  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm font-sans">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full">
          
          {/* LEFT PANEL: PRODUCT BROWSER */}
          <div className="flex-1 flex flex-col bg-slate-50/50">
            {/* Search & Categories */}
            <div className="p-5 border-b border-slate-100 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Tìm tên hoặc mã sản phẩm..." 
                    className="h-10 pl-9 bg-white border-slate-200 rounded-lg text-sm shadow-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button type="button" variant="outline" className="h-10 px-4 border-slate-200 rounded-lg gap-2 text-slate-600 text-xs font-semibold">
                  <Scan className="h-4 w-4" /> QUÉT MÃ
                </Button>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedCat(null)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 uppercase",
                    selectedCat === null ? "bg-primary text-white" : "bg-white text-slate-500 border border-slate-200"
                  )}
                >
                  Tất cả
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCat(cat.id)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 uppercase",
                      selectedCat === cat.id ? "bg-primary text-white" : "bg-white text-slate-500 border border-slate-200"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {isLoading ? (
                <div className="flex h-full items-center justify-center"><Spinner size="lg" /></div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {products.map((product) => (
                    <div 
                      key={product.id} 
                      onClick={() => handleProductClick(product)}
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
                        ) : <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-200">NO IMAGE</div>}
                        
                        {product.variants && product.variants.length > 1 && (
                          <div className="absolute top-2 right-2">
                             <Badge className="bg-primary/90 text-[8px] h-4 px-1.5">{product.variants.length} loại</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h4 className="text-[11px] font-semibold text-slate-700 line-clamp-2 leading-tight mb-1">{product.name}</h4>
                        <div className="mt-auto">
                          <p className="text-primary font-bold text-xs">{formatCurrency(product.basePrice)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: CART & CHECKOUT */}
          <div className="w-[360px] flex flex-col bg-white border-l border-slate-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-tighter">Đơn hàng #{orderId || "..."}</span>
              <button 
                type="button"
                onClick={() => {
                  form.setValue("items", []);
                  setAppliedDiscount(null);
                }}
                className="text-[10px] font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 uppercase"
              >
                <Trash2 className="h-3 w-3" /> Xóa sạch
              </button>
            </div>

            {/* Cart List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/20">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-30 text-slate-400">
                  <ShoppingCart className="h-10 w-10 mb-3" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Đang chờ món...</p>
                </div>
              ) : (
                items.map((item: any, index: number) => (
                  <div key={index} className="bg-white border border-slate-100 rounded-xl p-3 flex items-center gap-3 relative shadow-sm">
                    <div className="h-10 w-10 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-50 relative">
                      {item.image ? (
                        <Image 
                          src={item.image} 
                          alt={item.productName}
                          fill
                          className="h-full w-full object-cover"
                          sizes="40px"
                        />
                      ) : <div className="h-full w-full flex items-center justify-center text-[10px]">IMG</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-bold text-slate-900 truncate pr-6 leading-tight" title={item.productName.split('(')[0].trim()}>
                        {item.productName.split('(')[0].trim()}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">
                          {item.productName.match(/\(([^)]+)\)/)?.[1] || "Mặc định"}
                        </span>
                        <span className="text-xs font-black text-primary">{formatCurrency(item.price)}</span>
                      </div>
                    </div>
                    <div className="flex items-center bg-slate-50 rounded-lg border border-slate-100 p-0.5">
                      <button type="button" onClick={() => updateQuantity(index, -1)} className="h-5 w-5 flex items-center justify-center text-slate-400 hover:text-slate-900">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-[10px] font-bold text-slate-900">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(index, 1)} className="h-5 w-5 flex items-center justify-center text-slate-400 hover:text-slate-900">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => form.setValue("items", items.filter((_: any, i: number) => i !== index))}
                      className="absolute right-1 top-1 h-6 w-6 flex items-center justify-center text-slate-200 hover:text-rose-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            <div className="p-4 border-t border-slate-100 space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
              <div className="grid grid-cols-1 gap-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                  <Input placeholder="Số điện thoại khách hàng" {...form.register("guestPhone")} className="h-9 pl-8 bg-slate-50 border-slate-200 rounded-lg text-xs" />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                    <Input placeholder="Mã giảm giá" {...form.register("discountCode")} className="h-9 pl-8 bg-slate-50 border-slate-200 rounded-lg text-xs" />
                  </div>
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={handleValidateDiscount}
                    disabled={isValidatingDiscount || !form.watch("discountCode")}
                    className="h-9 px-3 bg-slate-900 text-white text-[10px] font-bold uppercase"
                  >
                    {isValidatingDiscount ? <Spinner size="sm" variant="white" /> : "Áp dụng"}
                  </Button>
                </div>
              </div>

              <div className="pt-1 space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  <span>Tạm tính</span>
                  <span className="text-slate-900">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[10px] font-bold text-rose-500 uppercase tracking-tighter">
                    <span>Giảm giá ({appliedDiscount?.code})</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase">Tổng trả</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "CASH", label: "Tiền mặt", icon: Wallet },
                  { id: "BANK_TRANSFER", label: "C.Khoản", icon: QrCode },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => form.setValue("paymentMethod", m.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all gap-1",
                      paymentMethod === m.id 
                        ? "bg-primary/5 border-primary text-primary" 
                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                    )}
                  >
                    <m.icon className="h-4 w-4" />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
                disabled={isSubmitting || items.length === 0}
              >
                {isSubmitting ? <Spinner size="sm" variant="white" /> : "Xác nhận & In hóa đơn"}
              </Button>
            </div>
          </div>

        </form>
      </Form>

      {/* QUICK VARIANT SELECTION MODAL */}
      <Dialog open={!!activeProduct} onOpenChange={(open) => !open && setActiveProduct(null)}>
        <DialogContent className="max-w-xl rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white rounded-xl border border-slate-200 overflow-hidden shrink-0 shadow-sm relative">
                {activeProduct?.images?.[0] && (
                  <Image 
                    src={(activeProduct.images[0] as any).url} 
                    alt={activeProduct.name} 
                    fill
                    className="h-full w-full object-cover"
                    sizes="64px"
                  />
                )}
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900 leading-tight">
                  {activeProduct?.name}
                </DialogTitle>
                <p className="text-sm font-semibold text-primary mt-1">
                  Giá cơ bản: {activeProduct && formatCurrency(activeProduct.basePrice)}
                </p>
              </div>
            </div>
          </DialogHeader>
          <div className="p-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <PackageSearch className="h-4 w-4 text-primary" /> Vui lòng chọn phân loại sản phẩm
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto p-1 scrollbar-thin">
              {activeProduct?.variants?.filter((v: ProductVariant) => v.isActive).map((variant: ProductVariant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => addVariantToCart(activeProduct, variant)}
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
            <Button variant="ghost" onClick={() => setActiveProduct(null)} className="text-slate-500 font-bold">Hủy bỏ</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
