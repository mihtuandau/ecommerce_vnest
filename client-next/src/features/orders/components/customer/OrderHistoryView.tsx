"use client";

import React, { useState } from "react";
import { useMyOrders } from "@/features/orders/hooks";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Search,
  Calendar,
  Truck,
  Check,
  MapPin,
  ShoppingCart,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import Image from "next/image";
import { OrderStatus } from "@/types/enums";
import { Skeleton } from "@/components/ui/Skeleton";
import { ReviewModal } from "@/features/reviews/components/customer/ReviewModal";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  EmptyState,
} from "@/components/ui";
import { getImageUrl } from "@/utils/image";
import { cn } from "@/utils/cn";
import { CUSTOMER_ORDER_STATUS_CONFIG } from "../../constants";
import { ProgressLine } from "./ProgressLine";

const getStatusLabel = (s: string) => {
  if (s === "ALL") return "Tất cả";
  return CUSTOMER_ORDER_STATUS_CONFIG[s as OrderStatus]?.label || s;
};

const getStatusStyle = (s: string) => {
  return (
    CUSTOMER_ORDER_STATUS_CONFIG[s as OrderStatus]?.cls || "bg-[#F3EFE8] text-[#8A7966]"
  );
};

export function OrderHistoryView() {
  const [status, setStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useMyOrders();
  const { addItem } = useCart();
  const { success } = useToast();
  const router = useRouter();

  const orders = data || [];

  const handleBuyAgain = (item: any) => {
    const getUrl = (img: any) => (typeof img === "string" ? img : img?.url);
    const imgSrc =
      (item.variantSnapshot as any)?.image ||
      getUrl(item.variant?.images?.[0]) ||
      getUrl(item.variant?.product?.images?.[0]);

    addItem({
      productId: String(
        item.variant?.productId || item.productId || item.variantSnapshot?.productId
      ),
      variantId: String(item.variantId || item.variant?.id),
      name:
        item.productName ||
        item.variantSnapshot?.productName ||
        item.variant?.product?.name,
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
      matchesStatus =
        o.status === OrderStatus.RETURN_REQUESTED || o.status === OrderStatus.RETURNED;
    }

    const matchesSearch =
      searchQuery === "" ||
      o.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderItems.some((item: any) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-brand-cream pb-24 font-sans-brand">
      {/* Breadcrumb Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <Breadcrumb>
          <BreadcrumbList className="text-sm font-medium">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Trang chủ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Đơn hàng của tôi</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="mb-10 space-y-1">
          <h1 className="text-3xl md:text-5xl font-bold font-serif-brand text-brand-espresso tracking-tight">
            Đơn hàng{" "}
            <em className="italic text-brand-bronze font-medium font-serif-brand">
              của tôi
            </em>
          </h1>
          <p className="text-[14px] text-brand-taupe font-medium">
            Quản lý và theo dõi tất cả đơn hàng
          </p>
        </div>

        
        <div className="bg-white border border-brand-sand rounded-[14px] p-[14px] px-[18px] mb-5 flex items-center justify-between gap-4">
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <Tabs value={status} onValueChange={setStatus} className="w-full">
              <TabsList className="bg-transparent h-auto p-0 gap-1 flex justify-start">
                {[
                  "ALL",
                  OrderStatus.PENDING,
                  OrderStatus.PROCESSING,
                  OrderStatus.SHIPPED,
                  OrderStatus.DELIVERED,
                  OrderStatus.CANCELLED,
                  OrderStatus.RETURN_REQUESTED,
                ].map((s) => (
                  <TabsTrigger
                    key={s}
                    value={s}
                    className={cn(
                      "px-[14px] py-[7px] rounded-full text-[13.5px] font-medium transition-all shadow-none border-[1.5px] border-brand-sand",
                      "data-[state=active]:bg-brand-espresso data-[state=active]:text-brand-cream data-[state=active]:border-brand-espresso",
                      "text-brand-taupe hover:border-brand-bronze hover:text-brand-espresso font-medium"
                    )}
                  >
                    {s === OrderStatus.RETURN_REQUESTED
                      ? "Trả hàng"
                      : getStatusLabel(s)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="relative w-[200px] shrink-0">
            <Input
              type="text"
              placeholder="Tìm đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[36px] pl-3 pr-9 bg-brand-ivory border-[1.5px] border-brand-sand rounded-full text-[13px] outline-none focus:border-brand-bronze transition-all font-medium text-brand-espresso"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-taupe z-10"
              size={14}
            />
          </div>
        </div>

        
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Không có đơn hàng nào"
              description="Chưa có đơn hàng phù hợp với bộ lọc này."
              actionText="Mua sắm ngay"
              onAction={() => router.push("/shop")}
            />
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-brand-sand rounded-[16px] overflow-hidden hover:shadow-[0_6px_24px_rgba(61,43,26,0.07)] transition-shadow group"
              >
                
                <div className="px-5 py-4 flex items-center gap-4 border-b border-brand-sand">
                  <span className="text-[14.5px] font-semibold text-brand-espresso font-mono tracking-tight">
                    {order.orderCode}
                  </span>
                  <div className="w-[1px] h-4 bg-brand-sand" />
                  <span className="text-[13px] text-brand-taupe font-medium">
                    📅 {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold",
                      getStatusStyle(order.status)
                    )}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    {getStatusLabel(order.status)}
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-[13px] text-brand-taupe font-medium">
                      Tổng:
                    </span>
                    <span className="text-[18px] font-sans font-semibold text-brand-espresso tabular-nums">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                
                <div className="px-5 py-4 flex items-center gap-3 border-b border-brand-sand">
                  <div className="flex gap-3 shrink-0">
                    {order.orderItems.slice(0, 3).map((item: any, idx: number) => {
                      const getUrl = (img: any) =>
                        typeof img === "string" ? img : img?.url;
                      const imgSrc =
                        (item.variantSnapshot as any)?.image ||
                        getUrl(item.variant?.images?.[0]) ||
                        getUrl(item.variant?.product?.images?.[0]);
                      return (
                        <div
                          key={item.id}
                          className="w-[56px] h-[66px] rounded-[8px] bg-brand-ivory border border-brand-sand flex items-center justify-center p-1.5 relative overflow-hidden shrink-0"
                        >
                          {imgSrc ? (
                            <Image
                              src={getImageUrl(imgSrc)}
                              alt=""
                              width={45}
                              height={55}
                              className="object-contain mix-blend-multiply"
                            />
                          ) : (
                            <span className="text-xl">📦</span>
                          )}
                          {item.quantity > 1 && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-espresso text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                              {item.quantity}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-medium text-brand-espresso mb-0.5 truncate font-medium">
                      {order.orderItems.map((i: any) => i.productName).join(" · ")}
                    </h4>
                    <p className="text-[13px] text-brand-taupe font-medium">
                      {order.orderItems.length} sản phẩm ·{" "}
                      {order.paymentMethod || "COD"}
                    </p>
                  </div>
                  {order.orderItems.length > 3 && (
                    <div className="text-[12px] text-brand-taupe bg-brand-ivory border border-brand-sand rounded-[8px] px-[10px] py-[4px] whitespace-nowrap font-medium">
                      +{order.orderItems.length - 3} khác
                    </div>
                  )}
                </div>

                
                <div className="px-5 py-3.5 border-b border-brand-sand">
                  {order.status === OrderStatus.CANCELLED ? (
                    <div className="text-[12.5px] text-red-600 flex items-center gap-1.5 font-medium">
                      Khách hàng huỷ đơn: Đặt nhầm sản phẩm
                    </div>
                  ) : (
                    <>
                      <ProgressLine currentStatus={order.status} />
                      <div className="flex items-center gap-1.5 text-[13px] text-brand-taupe mt-2.5 font-medium">
                        <Truck size={14} className="text-brand-bronze" />
                        Dự kiến giao:{" "}
                        <strong className="text-brand-espresso font-semibold tracking-tight">
                          16/05 – 17/05/2025
                        </strong>
                      </div>
                    </>
                  )}
                </div>

                
                <div className="px-5 py-3.5 flex items-center gap-2 bg-brand-cream/20">
                  <Button
                    variant="outline"
                    onClick={() => success("Đang mở trang theo dõi vận chuyển...")}
                    className="h-[36px] px-4 rounded-[8px] border-brand-sand text-brand-espresso text-[13px] font-medium hover:bg-brand-ivory flex items-center gap-1.5"
                  >
                    <MapPin size={14} />
                    Theo dõi đơn
                  </Button>
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="outline"
                      asChild
                      className="h-[36px] px-4 rounded-[8px] border-brand-sand text-brand-espresso text-[13px] font-medium hover:bg-brand-ivory flex items-center gap-1.5"
                    >
                      <Link href={`/orders/${order.id}`}>
                        <Search size={14} />
                        Chi tiết
                      </Link>
                    </Button>
                    <Button
                      onClick={() => handleBuyAgain(order.orderItems[0])}
                      className="h-[36px] px-4 rounded-[8px] bg-brand-espresso text-brand-cream border-brand-espresso text-[13px] font-medium hover:bg-brand-espresso/90 flex items-center gap-1.5"
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
