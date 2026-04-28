"use client";

import { Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/utils/formatCurrency";
import dayjs from "@/lib/dayjs";
import { STATUS_MAP } from "../constants";

interface RecentOrdersProps {
  orders: any[];
  isLoading: boolean;
}

export function RecentOrders({ orders, isLoading }: RecentOrdersProps) {
  const recentOrders =
    (Array.isArray(orders) ? orders : (orders as any))?.data || orders || [];

  return (
    <Card className="border border-slate-200 shadow-none rounded-xl overflow-hidden flex flex-col bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">
            Đơn hàng mới
          </CardTitle>
          <CardDescription className="text-xs font-medium text-slate-600">
            Giao dịch gần đây nhất
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          className="h-8 px-2 text-xs font-semibold tracking-wide text-primary hover:bg-primary/5"
          asChild
        >
          <Link href={ROUTES.ADMIN_ORDERS}>Xem tất cả</Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-10 w-10 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-2 w-16 bg-muted rounded" />
                </div>
              </div>
            ))
          ) : recentOrders.length > 0 ? (
            recentOrders.slice(0, 5).map((order: any, index: number) => {
              const firstItem = order.orderItems?.[0];

              // Safe image resolver
              const getImageUrl = (item: any) => {
                const images =
                  item.variant?.images || item.variant?.product?.images || [];
                if (images.length === 0) return null;
                const firstImg = images[0];
                const rawUrl =
                  typeof firstImg === "string" ? firstImg : firstImg?.url || "";
                return rawUrl?.startsWith("http") ? rawUrl : `/${rawUrl}`;
              };

              const imageUrl = getImageUrl(firstItem);

              return (
                <div
                  key={index}
                  className="flex items-center justify-between group p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-400 overflow-hidden shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Order item"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        order.orderCode?.slice(-3) || "ORD"
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-800 leading-none line-clamp-1">
                          {order.user?.name ||
                            order.shippingSnapshot?.fullName ||
                            "Khách lẻ"}
                        </p>
                        {(order.guestPhone || order.user?.phone) && (
                          <span className="text-xs font-semibold text-primary px-2 py-0.5 bg-primary/5 rounded">
                            {order.guestPhone || order.user?.phone}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {dayjs(order.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800 mb-1">
                      {formatCurrency(order.total)}
                    </p>
                    <div
                      className={`text-xs font-semibold tracking-wide px-2.5 py-1 rounded-md inline-block ${STATUS_MAP[order.status]?.bg} ${STATUS_MAP[order.status]?.color}`}
                    >
                      {STATUS_MAP[order.status]?.label || order.status}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-muted-foreground italic text-xs font-medium">
              Chưa có đơn hàng nào
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
