"use client";

import { useOrders, useCancelOrder } from "@/features/orders/hooks";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Package, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";

const statusLabelMap: Record<string, string> = {
  PENDING: "Chờ thanh toán",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

export default function CustomerOrdersPage() {
  const [status, setStatus] = useState("ALL");
  const { data, isLoading } = useOrders({ 
    status: status === "ALL" ? undefined : status 
  });
  const { mutate: cancelOrder } = useCancelOrder();

  const orders = data || [];

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đơn hàng của tôi</h1>
          <p className="text-muted-foreground">Xem lại lịch sử mua hàng và trạng thái đơn hàng của bạn.</p>
        </div>

        <Tabs value={status} onValueChange={setStatus} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto h-12 bg-transparent border-b rounded-none p-0">
            {["ALL", "PENDING", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED"].map((s) => (
              <TabsTrigger 
                key={s} 
                value={s}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
              >
                {s === "ALL" ? "Tất cả" : statusLabelMap[s]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-32" />
              </Card>
            ))
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-xl">
              <Package className="h-12 w-12 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground">Không tìm thấy đơn hàng nào.</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/">Tiếp tục mua sắm</Link>
              </Button>
            </div>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b bg-muted/20">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold">Mã đơn: {order.orderCode}</p>
                        <p className="text-xs text-muted-foreground">Ngày đặt: {formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-3">
                      <Badge variant="outline">{statusLabelMap[order.status] || order.status}</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 rounded border overflow-hidden shrink-0">
                        <img src={order.orderItems[0]?.product?.images[0] || "/placeholder.png"} alt="Product" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">{order.orderItems[0]?.product?.name}</p>
                        <p className="text-xs text-muted-foreground">Số lượng: {order.orderItems[0]?.quantity}</p>
                        {order.orderItems.length > 1 && (
                          <p className="text-xs text-primary mt-1 font-medium">và {order.orderItems.length - 1} sản phẩm khác</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{formatCurrency(order.totalAmount)}</p>
                        <p className="text-[10px] text-muted-foreground">Tổng cộng</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <AlertCircle className="h-3 w-3" />
                        <span>Dự kiến giao hàng trong 2-3 ngày làm việc</span>
                      </div>
                      <div className="flex gap-2">
                        {order.status === "PENDING" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive hover:bg-destructive/10 border-destructive/20"
                            onClick={() => {
                              if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
                                cancelOrder(order.id);
                              }
                            }}
                          >
                            Hủy đơn
                          </Button>
                        )}
                        <Button size="sm" asChild>
                          <Link href={`/orders/${order.id}`}>Chi tiết</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
