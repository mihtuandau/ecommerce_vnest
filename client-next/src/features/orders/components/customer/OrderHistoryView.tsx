"use client";

import React, { useState } from "react";
import { useMyOrders, useCancelOrder } from "@/features/orders/hooks";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { OrderStatus, PaymentStatus } from "@/types/enums";
import { Skeleton } from "@/components/ui/Skeleton";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const statusLabelMap: Record<string, string> = {
  ALL: "Tất cả",
  [OrderStatus.PENDING]: "Chờ xử lý",
  [OrderStatus.PROCESSING]: "Đang xử lý",
  [OrderStatus.SHIPPED]: "Đang giao",
  [OrderStatus.DELIVERED]: "Đã giao",
  [OrderStatus.CANCELLED]: "Đã hủy",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  [OrderStatus.PENDING]: {
    label: "Chờ xử lý",
    color: "bg-slate-50 text-slate-600 border-slate-100",
  },
  [OrderStatus.PROCESSING]: {
    label: "Đang xử lý",
    color: "bg-blue-50 text-primary border-blue-100",
  },
  [OrderStatus.SHIPPED]: {
    label: "Đang giao hàng",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  [OrderStatus.DELIVERED]: {
    label: "Đã giao hàng",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  [OrderStatus.CANCELLED]: {
    label: "Đã hủy",
    color: "bg-rose-50 text-rose-600 border-rose-100",
  },
};

export function OrderHistoryView() {
  const [status, setStatus] = useState("ALL");
  const { data, isLoading } = useMyOrders();
  const { mutate: cancelOrder } = useCancelOrder();
  const orders = data || [];

  const getCount = (s: string) => {
    if (s === "ALL") return orders.length;
    return orders.filter((o) => o.status === s).length;
  };

  const filteredOrders =
    status === "ALL" ? orders : orders.filter((o) => o.status === status);

  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
          <Link
            href="/"
            className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#1565C1] hover:border-[#1565C1] hover:bg-blue-50 transition-all shrink-0"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Đơn hàng của tôi
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Theo dõi và quản lý lịch sử mua hàng của bạn
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <Tabs value={status} onValueChange={setStatus} className="w-full">
            <TabsList className="flex w-full overflow-x-auto no-scrollbar h-auto p-1 bg-white rounded-2xl border border-slate-100 shadow-sm gap-1">
              {[
                "ALL",
                OrderStatus.PENDING,
                OrderStatus.PROCESSING,
                OrderStatus.SHIPPED,
                OrderStatus.DELIVERED,
                OrderStatus.CANCELLED,
              ].map((s) => (
                <TabsTrigger
                  key={s}
                  value={s}
                  className="flex-1 min-w-[100px] py-3 rounded-xl text-[12px] font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <div className="flex items-center gap-2">
                    <span>{statusLabelMap[s]}</span>
                    {getCount(s) > 0 && (
                      <span
                        className={`flex items-center justify-center min-w-[18px] h-4.5 px-1 rounded-full text-[9px] ${
                          status === s
                            ? "bg-white/20 text-white"
                            : "bg-slate-50 text-slate-400"
                        }`}
                      >
                        {getCount(s)}
                      </span>
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid gap-6">
            {isLoading ? (
              <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="rounded-2xl border border-slate-100 overflow-hidden bg-white"
                  >
                    <div className="px-6 py-4 bg-slate-50/30 border-b border-slate-100 flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <div className="p-8 flex gap-8">
                      <Skeleton className="h-20 w-20 rounded-2xl" />
                      <div className="flex-1 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <div className="flex gap-6">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-4">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-11 w-40 rounded-2xl" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-24 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg">
                  Chưa có đơn hàng
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Khám phá các sản phẩm mới nhất của chúng tôi
                </p>
                <Button
                  className="mt-8 rounded-full px-8 bg-primary shadow-lg shadow-blue-500/20"
                  asChild
                >
                  <Link href="/">Mua sắm ngay</Link>
                </Button>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isPaid =
                  order.paymentStatus === "PAID" ||
                  order.paymentStatus === PaymentStatus.SUCCESS ||
                  order.payment?.status === "PAID" ||
                  order.payment?.status === PaymentStatus.SUCCESS;

                let displayStatus = statusConfig[order.status] || {
                  label: order.status,
                  color: "bg-slate-50 text-slate-600 border-slate-100",
                };

                if (order.status === OrderStatus.PENDING && isPaid) {
                  displayStatus = {
                    label: "Đã thanh toán",
                    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
                  };
                }

                return (
                  <Card
                    key={order.id}
                    className="group border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden bg-white"
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between px-6 py-4 bg-slate-50/30 border-b border-slate-100">
                        <div className="flex items-center gap-5 text-[12px]">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-medium uppercase tracking-widest text-[9px]">
                              Mã đơn
                            </span>
                            <span className="font-semibold text-slate-700">
                              {order.orderCode}
                            </span>
                          </div>
                          <span className="text-slate-200">|</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-medium uppercase tracking-widest text-[9px]">
                              Ngày đặt
                            </span>
                            <span className="text-slate-600 font-medium">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`rounded-full px-3 py-1.5 text-[11px] font-medium border h-fit leading-none flex items-center justify-center ${displayStatus.color}`}
                        >
                          {displayStatus.label}
                        </div>
                      </div>

                      <div className="p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                          <div className="flex flex-1 gap-8 items-center">
                            <div className="h-20 w-20 rounded-2xl border border-slate-100 overflow-hidden shrink-0 bg-slate-50/50 p-2 group-hover:border-primary/20 transition-colors">
                              <img
                                src={
                                  order.orderItems[0]?.variant?.product?.images[0]
                                    ?.url ||
                                  order.orderItems[0]?.variant?.images[0]?.url ||
                                  "/placeholder.png"
                                }
                                alt="Product"
                                className="h-full w-full object-contain mix-blend-multiply"
                              />
                            </div>
                            <div className="flex-1 min-w-0 space-y-3">
                              <div>
                                <h4 className="text-[16px] font-semibold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                                  {order.orderItems[0]?.productName ||
                                    order.orderItems[0]?.variant?.product?.name}
                                </h4>
                                {(order.orderItems[0]?.variant?.size ||
                                  order.orderItems[0]?.variant?.color) && (
                                  <p className="text-[12px] text-primary font-medium mt-1">
                                    {[
                                      order.orderItems[0]?.variant?.color,
                                      order.orderItems[0]?.variant?.size,
                                    ]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-6 pt-1">
                                <div className="space-y-1">
                                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium">
                                    Khách hàng
                                  </p>
                                  <p className="text-[13px] font-semibold text-slate-700">
                                    {order.shippingSnapshot?.fullName ||
                                      order.user?.name ||
                                      order.fullName ||
                                      "Khách hàng"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium">
                                    Số lượng
                                  </p>
                                  <p className="text-[13px] font-semibold text-slate-700">
                                    x{order.orderItems[0]?.quantity}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium">
                                    Thanh toán
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-semibold text-slate-700">
                                      {order.paymentMethod || "COD"}
                                    </span>
                                    <div
                                      className={`px-2 py-0.5 rounded-md text-[9px] font-semibold border ${
                                        isPaid
                                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                          : "bg-amber-50 text-amber-600 border-amber-100"
                                      }`}
                                    >
                                      {isPaid ? "ĐÃ THANH TOÁN" : "CHỜ THANH TOÁN"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-6 lg:min-w-[240px] pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-50">
                            <div className="text-left lg:text-right space-y-1">
                              <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium">
                                Tổng cộng
                              </p>
                              <p className="text-2xl font-semibold text-primary tabular-nums tracking-tighter leading-none">
                                {formatCurrency(order.total)}
                              </p>
                            </div>

                            <div className="flex gap-3 w-full sm:w-auto">
                              {order.status === OrderStatus.PENDING && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-11 px-6 rounded-2xl text-rose-500 hover:bg-rose-50 text-[13px] font-semibold"
                                  onClick={() => {
                                    if (
                                      confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")
                                    ) {
                                      cancelOrder(order.id);
                                    }
                                  }}
                                >
                                  Hủy đơn
                                </Button>
                              )}
                              <Button
                                className="h-11 px-10 rounded-2xl bg-primary hover:bg-[#0d47a1] text-white text-[13px] font-semibold shadow-lg shadow-blue-500/10 transition-all active:scale-95"
                                asChild
                              >
                                <Link href={`/orders/${order.id}`}>Chi tiết</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
