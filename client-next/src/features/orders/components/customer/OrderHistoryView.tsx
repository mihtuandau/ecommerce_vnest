"use client";

import React, { useState } from "react";
import { useMyOrders } from "@/features/orders/hooks";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { 
  Search, 
  Calendar, 
  Truck, 
  Check, 
  MapPin, 
  ShoppingCart, 
  ShoppingBag,
  ArrowLeft
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
  [OrderStatus.PROCESSING]: "Đã xác nhận",
  [OrderStatus.SHIPPED]: "Đang giao",
  [OrderStatus.DELIVERED]: "Đã giao",
  [OrderStatus.CANCELLED]: "Đã huỷ",
  [OrderStatus.RETURN_REQUESTED]: "Trả hàng",
  [OrderStatus.RETURNED]: "Đã trả hàng",
};

const statusStyleMap: Record<string, string> = {
  [OrderStatus.PENDING]: "bg-[#FFF8E6] text-[#C49A00]",
  [OrderStatus.PROCESSING]: "bg-[#E8F0F8] text-[#2C5F8A]",
  [OrderStatus.SHIPPED]: "bg-[#E8F0F8] text-[#2C5F8A]",
  [OrderStatus.DELIVERED]: "bg-[#E6F3EC] text-[#3A7D5A]",
  [OrderStatus.CANCELLED]: "bg-[#FCEAEA] text-[#C44040]",
  [OrderStatus.RETURN_REQUESTED]: "bg-[#FFF2E6] text-[#C4783A]",
  [OrderStatus.RETURNED]: "bg-[#F3EFE8] text-[#3D2B1A]",
};

const ProgressLine = ({ currentStatus }: { currentStatus: string }) => {
  const isReturn = currentStatus === OrderStatus.RETURN_REQUESTED || currentStatus === OrderStatus.RETURNED;
  
  const baseSteps = [
    { key: OrderStatus.PENDING, label: "Đặt hàng" },
    { key: OrderStatus.PROCESSING, label: "Đã xác nhận" },
    { key: OrderStatus.SHIPPED, label: "Vận chuyển" },
    { key: OrderStatus.DELIVERED, label: "Đã giao" },
  ];

  const steps = isReturn 
    ? [...baseSteps, { key: OrderStatus.RETURN_REQUESTED, label: "Trả hàng" }]
    : baseSteps;

  const getStatusIndex = (status: string) => {
    if (status === OrderStatus.RETURNED) return steps.length - 1;
    if (status === OrderStatus.RETURN_REQUESTED) return steps.length - 1;
    const idx = steps.findIndex(s => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between items-center px-4">
        {/* Background Line */}
        <div className="absolute top-[11px] left-10 right-10 h-[2px] bg-[#DDD6C8]" />
        {/* Active Line */}
        <div 
          className="absolute top-[11px] left-10 h-[2px] bg-[#3A7D5A] transition-all duration-700" 
          style={{ width: `calc(${(currentIndex / (steps.length - 1)) * 100}% - 20px)` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isActive = idx === currentIndex;
          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 w-20">
              <div className={cn(
                "w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 transition-all duration-500 text-[9px]",
                isCompleted 
                  ? "bg-[#3A7D5A] border-[#3A7D5A] text-white" 
                  : "bg-white border-[#DDD6C8] text-transparent"
              )}>
                {isCompleted && <Check size={10} strokeWidth={3} />}
              </div>
              <span className={cn(
                "text-[12px] mt-2 whitespace-nowrap transition-colors duration-300 font-medium",
                isCompleted ? "text-[#3A7D5A]" : "text-[#8A7966]",
                isActive && "font-bold text-[#C4783A]"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function OrderHistoryView() {
  const [status, setStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useMyOrders();
  const { addItem } = useCart();
  const { success } = useToast();
  
  const orders = data || [];

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
    
    // special case for returns: show both requested and returned
    if (status === OrderStatus.RETURN_REQUESTED) {
      matchesStatus = o.status === OrderStatus.RETURN_REQUESTED || o.status === OrderStatus.RETURNED;
    }

    const matchesSearch = searchQuery === "" || 
      o.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderItems.some((item: any) => item.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F4] pb-24 font-sans-brand">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-9">
        
        {/* ── BREADCRUMBS ── */}
        <div className="flex items-center gap-1.5 text-[12.5px] text-[#8A7966] mb-8">
          <Link href="/" className="hover:text-[#3D2B1A] transition-colors">Trang chủ</Link>
          <span className="opacity-50">›</span>
          <span className="text-[#3D2B1A] font-medium">Đơn hàng của tôi</span>
        </div>

        {/* Header - Combined Row */}
        <div className="mb-10 space-y-1">
          <h1 className="text-3xl md:text-5xl font-bold font-serif-brand text-[#3D2B1A] tracking-tight">
            Đơn hàng <em className="italic text-[#C4783A] font-medium font-serif-brand">của tôi</em>
          </h1>
          <p className="text-[14px] text-[#8A7966] font-medium">
            Quản lý và theo dõi tất cả đơn hàng
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-[#DDD6C8] rounded-[14px] p-[14px] px-[18px] mb-5 flex items-center justify-between gap-4">
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <Tabs value={status} onValueChange={setStatus} className="w-full">
              <TabsList className="bg-transparent h-auto p-0 gap-1 flex justify-start">
                {["ALL", OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.RETURN_REQUESTED].map((s) => (
                  <TabsTrigger
                    key={s}
                    value={s}
                    className={cn(
                      "px-[14px] py-[7px] rounded-full text-[13.5px] font-medium transition-all shadow-none border-[1.5px] border-[#DDD6C8]",
                      "data-[state=active]:bg-[#3D2B1A] data-[state=active]:text-[#FAF8F4] data-[state=active]:border-[#3D2B1A]",
                      "text-[#8A7966] hover:border-[#C4B49A] hover:text-[#3D2B1A] font-medium"
                    )}
                  >
                    {s === OrderStatus.RETURN_REQUESTED ? "Trả hàng" : (statusLabelMap[s] || s)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="relative w-[200px] shrink-0">
            <input 
              type="text" 
              placeholder="Tìm đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[36px] pl-3 pr-9 bg-[#F3EFE8] border-[1.5px] border-[#DDD6C8] rounded-full text-[13px] outline-none focus:border-[#C4B49A] transition-all font-medium"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7966]" size={14} />
          </div>
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {isLoading ? (
             <div className="space-y-4">
                {[1, 2].map((i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
             </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-[16px] border border-[#DDD6C8]">
              <div className="text-[60px] opacity-35 mb-4">📭</div>
              <h3 className="text-[22px] font-serif-brand text-[#3D2B1A] mb-2">Không có đơn hàng nào</h3>
              <p className="text-[14px] text-[#8A7966] mb-6 font-medium">Chưa có đơn hàng phù hợp với bộ lọc này.</p>
              <Button asChild className="rounded-full bg-[#3D2B1A] text-[#FAF8F4] px-7 py-3 font-medium hover:bg-[#2A2420]">
                <Link href="/shop">Mua sắm ngay</Link>
              </Button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white border border-[#DDD6C8] rounded-[16px] overflow-hidden hover:shadow-[0_6px_24px_rgba(61,43,26,0.07)] transition-shadow group">
                {/* Header */}
                <div className="px-5 py-4 flex items-center gap-4 border-b border-[#DDD6C8]">
                  <span className="text-[14.5px] font-semibold text-[#3D2B1A] font-mono tracking-tight">{order.orderCode}</span>
                  <div className="w-[1px] h-4 bg-[#DDD6C8]" />
                  <span className="text-[13px] text-[#8A7966] font-medium">📅 {new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold",
                    statusStyleMap[order.status] || "bg-[#F3EFE8] text-[#8A7966]"
                  )}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    {statusLabelMap[order.status] || order.status}
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-[13px] text-[#8A7966] font-medium">Tổng:</span>
                    <span className="text-[18px] font-serif-brand font-semibold text-[#3D2B1A]">{formatCurrency(order.total)}</span>
                  </div>
                </div>

                {/* Items Row */}
                <div className="px-5 py-4 flex items-center gap-3 border-b border-[#DDD6C8]">
                  <div className="flex gap-3 shrink-0">
                    {order.orderItems.slice(0, 3).map((item: any, idx: number) => {
                       const getUrl = (img: any) => typeof img === 'string' ? img : img?.url;
                       const imgSrc = (item.variantSnapshot as any)?.image || getUrl(item.variant?.images?.[0]) || getUrl(item.variant?.product?.images?.[0]);
                       return (
                         <div key={item.id} className="w-[56px] h-[66px] rounded-[8px] bg-[#F3EFE8] border border-[#DDD6C8] flex items-center justify-center p-1.5 relative overflow-hidden shrink-0">
                           {imgSrc ? (
                             <Image src={getImageUrl(imgSrc)} alt="" width={45} height={55} className="object-contain mix-blend-multiply" />
                           ) : (
                             <span className="text-xl">📦</span>
                           )}
                           {item.quantity > 1 && (
                             <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#3D2B1A] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                               {item.quantity}
                             </span>
                           )}
                         </div>
                       );
                    })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-medium text-[#3D2B1A] mb-0.5 truncate font-medium">
                      {order.orderItems.map((i:any) => i.productName).join(" · ")}
                    </h4>
                    <p className="text-[13px] text-[#8A7966] font-medium">
                      {order.orderItems.length} sản phẩm · {order.paymentMethod || "COD"}
                    </p>
                  </div>
                  {order.orderItems.length > 3 && (
                    <div className="text-[12px] text-[#8A7966] bg-[#F3EFE8] border border-[#DDD6C8] rounded-[8px] px-[10px] py-[4px] whitespace-nowrap font-medium">
                      +{order.orderItems.length - 3} khác
                    </div>
                  )}
                </div>

                {/* Tracking Mini */}
                <div className="px-5 py-3.5 border-b border-[#DDD6C8]">
                  {order.status === OrderStatus.CANCELLED ? (
                    <div className="text-[12.5px] text-[#C44040] flex items-center gap-1.5 font-medium">
                      Khách hàng huỷ đơn: Đặt nhầm sản phẩm
                    </div>
                  ) : (
                    <>
                      <ProgressLine currentStatus={order.status} />
                      <div className="flex items-center gap-1.5 text-[13px] text-[#8A7966] mt-2.5 font-medium">
                        <Truck size={14} className="text-[#C4783A]" />
                        Dự kiến giao: <strong className="text-[#3D2B1A] font-semibold tracking-tight">16/05 – 17/05/2025</strong>
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="px-5 py-3.5 flex items-center gap-2 bg-[#FAF8F4]/20">
                  <Button 
                    variant="outline" 
                    onClick={() => success("Đang mở trang theo dõi vận chuyển...")}
                    className="h-[36px] px-4 rounded-[8px] border-[#DDD6C8] text-[#3D2B1A] text-[13px] font-medium hover:bg-[#F3EFE8] flex items-center gap-1.5"
                  >
                    <MapPin size={14} />
                    Theo dõi đơn
                  </Button>
                  <div className="ml-auto flex gap-2">
                    <Button variant="outline" asChild className="h-[36px] px-4 rounded-[8px] border-[#DDD6C8] text-[#3D2B1A] text-[13px] font-medium hover:bg-[#F3EFE8] flex items-center gap-1.5">
                      <Link href={`/orders/${order.id}`}>
                        <Search size={14} />
                        Chi tiết
                      </Link>
                    </Button>
                    <Button 
                      onClick={() => handleBuyAgain(order.orderItems[0])}
                      className="h-[36px] px-4 rounded-[8px] bg-[#3D2B1A] text-[#FAF8F4] border-[#3D2B1A] text-[13px] font-medium hover:bg-[#2A2420] flex items-center gap-1.5"
                    >
                      <ShoppingCart size={14} />
                      Mua lại
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
