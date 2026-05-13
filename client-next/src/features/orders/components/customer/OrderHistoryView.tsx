"use client";

import React, { useState } from "react";
import { useMyOrders } from "@/features/orders/hooks";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { 
  Package, 
  Search, 
  Store, 
  ChevronRight, 
  ShoppingBag, 
  MessageSquare, 
  RotateCcw, 
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import Image from "next/image";
import { OrderStatus } from "@/types/enums";
import { Skeleton } from "@/components/ui/Skeleton";
import { ReviewModal } from "@/features/reviews/components/customer/ReviewModal";
import { getImageUrl } from "@/utils/image";
import { cn } from "@/utils/cn";

const statusLabelMap: Record<string, string> = {
  ALL: "Tất cả",
  [OrderStatus.PENDING]: "Chờ xác nhận",
  [OrderStatus.SHIPPED]: "Đang giao",
  [OrderStatus.DELIVERED]: "Đã nhận",
  [OrderStatus.CANCELLED]: "Đã hủy",
  [OrderStatus.RETURN_REQUESTED]: "Trả hàng / Hoàn tiền",
};

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  [OrderStatus.PENDING]: {
    label: "Chờ xác nhận",
    color: "text-amber-600 bg-amber-50 border-amber-100",
    icon: Clock,
  },
  [OrderStatus.PROCESSING]: {
    label: "Đang xử lý",
    color: "text-blue-600 bg-blue-50 border-blue-100",
    icon: Package,
  },
  [OrderStatus.SHIPPED]: {
    label: "Đang giao hàng",
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    icon: Truck,
  },
  [OrderStatus.DELIVERED]: {
    label: "Giao thành công",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    icon: CheckCircle2,
  },
  [OrderStatus.CANCELLED]: {
    label: "Đã hủy đơn",
    color: "text-rose-600 bg-rose-50 border-rose-100",
    icon: XCircle,
  },
  [OrderStatus.RETURN_REQUESTED]: {
    label: "Yêu cầu trả hàng",
    color: "text-amber-600 bg-amber-50 border-amber-100",
    icon: AlertCircle,
  },
  [OrderStatus.RETURNED]: {
    label: "Đã trả hàng",
    color: "text-purple-600 bg-purple-50 border-purple-100",
    icon: CheckCircle2,
  },
};

export function OrderHistoryView() {
  const [status, setStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useMyOrders();
  const { addItem } = useCart();
  const { success } = useToast();
  const [selectedReviewItem, setSelectedReviewItem] = useState<any>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(0);
  const [selectedOrderCode, setSelectedOrderCode] = useState<string>("");
  
  const orders = data || [];

  const getCount = (s: string) => {
    if (s === "ALL") return orders.length;
    if (s === OrderStatus.PENDING) {
      return orders.filter((o) => o.status === OrderStatus.PENDING || o.status === OrderStatus.PROCESSING).length;
    }
    if (s === OrderStatus.RETURN_REQUESTED) {
      return orders.filter((o) => o.status === OrderStatus.RETURN_REQUESTED || o.status === OrderStatus.RETURNED).length;
    }
    return orders.filter((o) => o.status === s).length;
  };

  const handleBuyAgain = (item: any) => {
    const getUrl = (img: any) => typeof img === 'string' ? img : img?.url;
    const imgSrc = (item.variantSnapshot as any)?.image ||
                  getUrl(item.variant?.images?.[0]) ||
                  getUrl(item.variant?.product?.images?.[0]);

    addItem({
      productId: String(item.variant?.productId || item.productId || item.variantSnapshot?.productId),
      variantId: String(item.variantId || item.variant?.id),
      name: item.productName || item.variantSnapshot?.productName || item.variant?.product?.name,
      price: item.price,
      imageUrl: getImageUrl(imgSrc),
      slug: item.variant?.product?.slug || item.slug || item.variantSnapshot?.slug,
      color: item.variant?.color || item.variantSnapshot?.color,
      size: item.variant?.size || item.variantSnapshot?.size,
      quantity: 1,
    });
    success(`Đã thêm vào giỏ hàng`);
  };

  const filteredOrders = orders.filter((o) => {
    let matchesStatus = status === "ALL" || o.status === status;
    if (status === OrderStatus.PENDING) {
      matchesStatus = o.status === OrderStatus.PENDING || o.status === OrderStatus.PROCESSING;
    }
    if (status === OrderStatus.RETURN_REQUESTED) {
      matchesStatus = o.status === OrderStatus.RETURN_REQUESTED || o.status === OrderStatus.RETURNED;
    }
    const matchesSearch = searchQuery === "" || 
      o.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderItems.some((item: any) => item.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      <div className="max-w-[1100px] mx-auto px-4 pt-8 md:pt-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
             <Link href="/" className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
                <ArrowLeft size={18} />
             </Link>
             <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Đơn hàng của tôi</h1>
          </div>

          <div className="relative group max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Tìm theo mã đơn, sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 overflow-x-auto no-scrollbar">
          <Tabs value={status} onValueChange={setStatus} className="w-full">
            <TabsList className="flex w-full bg-transparent h-auto p-0 border-b border-slate-200 rounded-none gap-8 min-w-max shadow-none">
              {[
                "ALL",
                OrderStatus.PENDING,
                OrderStatus.SHIPPED,
                OrderStatus.DELIVERED,
                OrderStatus.CANCELLED,
                OrderStatus.RETURN_REQUESTED,
              ].map((s) => (
                <TabsTrigger
                  key={s}
                  value={s}
                  className="px-0 py-4 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm font-bold text-slate-500 data-[state=active]:text-primary transition-all shadow-none group"
                >
                  <div className="flex items-center gap-2">
                    {statusLabelMap[s]}
                    {getCount(s) > 0 && (
                      <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-slate-100 text-[10px] text-slate-500 group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary transition-all">
                        {getCount(s)}
                      </span>
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Order List */}
        <div className="space-y-6">
          {isLoading ? (
             <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between border-b border-slate-50 pb-4">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-6 w-24 rounded-md" />
                    </div>
                    <div className="flex gap-4">
                      <Skeleton className="h-20 w-20 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-xl border border-slate-200 border-dashed">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-10 w-10 text-slate-200" />
              </div>
              <p className="text-slate-500 font-medium">Không tìm thấy đơn hàng nào</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const displayStatus = statusConfig[order.status] || {
                label: order.status,
                color: "text-slate-500 bg-slate-50 border-slate-100",
                icon: Package
              };

              return (
                <div key={order.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden group hover:border-slate-300 transition-all">
                  {/* Card Header */}
                  <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                        <Store size={16} className="text-slate-400" />
                        Minh Tuấn Shop
                        <ChevronRight size={14} className="text-slate-300" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">#{order.orderCode}</span>
                    </div>
                    
                    <div className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border",
                      displayStatus.color
                    )}>
                      <displayStatus.icon size={12} />
                      {displayStatus.label}
                    </div>
                  </div>

                  {/* Card Body - Items */}
                  <Link href={`/orders/${order.id}`} className="block divide-y divide-slate-50">
                    {order.orderItems.map((item: any, idx: number) => {
                      const getUrl = (img: any) => typeof img === 'string' ? img : img?.url;
                      const imgSrc = (item.variantSnapshot as any)?.image ||
                                    getUrl(item.variant?.images?.[0]) ||
                                    getUrl(item.variant?.product?.images?.[0]);

                      return (
                        <div key={item.id} className="p-5 flex gap-4">
                          <div className="h-20 w-20 rounded-lg bg-slate-50 border border-slate-100 shrink-0 p-1.5 relative overflow-hidden">
                            <Image
                              src={getImageUrl(imgSrc)}
                              alt={item.productName}
                              fill
                              className="object-contain mix-blend-multiply"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-4">
                              <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                                {item.productName || item.variantSnapshot?.productName}
                              </h4>
                              <span className="text-sm font-bold text-slate-900 tabular-nums">
                                {formatCurrency(item.price)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                              {[item.variant?.color || item.variantSnapshot?.color, item.variant?.size || item.variantSnapshot?.size].filter(Boolean).join(" / ")}
                            </p>
                            <p className="text-[11px] text-slate-400 font-bold mt-1">x{item.quantity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </Link>

                  {/* Card Footer */}
                  <div className="px-5 py-4 bg-slate-50/30 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                       <div className="text-xs text-slate-400 font-medium italic">
                         {new Date(order.createdAt).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                       </div>

                       <div className="flex items-center gap-6 justify-between sm:justify-end">
                         <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-500">Tổng số tiền:</span>
                            <span className="text-lg font-bold text-blue-600 tabular-nums">
                              {formatCurrency(order.total)}
                            </span>
                         </div>
                         
                         <div className="flex items-center gap-2">
                           {order.status === OrderStatus.DELIVERED ? (
                             <>
                               <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-9 px-4 rounded-lg text-xs font-bold border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
                                  onClick={() => handleBuyAgain(order.orderItems[0])}
                               >
                                 Mua lại
                               </Button>
                               {!order.reviews?.length && (
                                 <Button 
                                    size="sm" 
                                    className="h-9 px-4 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-all shadow-none"
                                    onClick={() => {
                                      setSelectedReviewItem(order.orderItems[0]);
                                      setSelectedOrderId(order.id);
                                      setSelectedOrderCode(order.orderCode);
                                    }}
                                 >
                                   Đánh giá
                                 </Button>
                               )}
                             </>
                           ) : (
                             <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-9 px-4 rounded-lg text-xs font-bold border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
                                asChild
                             >
                               <Link href={`/orders/${order.id}`}>Theo dõi đơn hàng</Link>
                             </Button>
                           )}
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedReviewItem && (
        <ReviewModal 
          isOpen={!!selectedReviewItem}
          onClose={() => setSelectedReviewItem(null)}
          productId={Number(selectedReviewItem?.variant?.productId || selectedReviewItem?.productId)}
          orderId={selectedOrderId}
          orderCode={selectedOrderCode}
          productName={selectedReviewItem?.productName || selectedReviewItem?.variant?.product?.name}
          productSlug={selectedReviewItem?.variant?.product?.slug}
          variantName={[selectedReviewItem?.variant?.color, selectedReviewItem?.variant?.size].filter(Boolean).join(", ")}
          productImage={getImageUrl(
            (selectedReviewItem?.variantSnapshot as any)?.image || 
            (typeof selectedReviewItem?.variant?.product?.images?.[0] === 'string' 
              ? selectedReviewItem?.variant?.product?.images?.[0] 
              : selectedReviewItem?.variant?.product?.images?.[0]?.url)
          )}
        />
      )}
    </div>
  );
}
