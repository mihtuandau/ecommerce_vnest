"use client";

import { Eye, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/utils/formatCurrency";
import dayjs from "@/lib/dayjs";
import { STATUS_MAP } from "../constants";
import { Skeleton } from "@/components/ui/Skeleton";

interface RecentOrdersProps {
  orders: any[];
  isLoading: boolean;
}

export function RecentOrders({ orders, isLoading }: RecentOrdersProps) {
  const recentOrders =
    (Array.isArray(orders) ? orders : (orders as any))?.data || orders || [];

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-4 px-6 border-b border-slate-50">
        <CardTitle className="text-base font-semibold text-slate-900">
          Đơn hàng gần đây
        </CardTitle>
        <Button
          variant="link"
          className="text-primary font-medium text-sm flex items-center gap-1 hover:no-underline p-0"
          asChild
        >
          <Link href={ROUTES.ADMIN_ORDERS}>
            Xem tất cả <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="text-xs font-medium text-slate-500 py-4 pl-6">
                Mã đơn
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500 py-4">
                Khách hàng
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500 py-4">
                Sản phẩm
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500 py-4">
                Tổng tiền
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500 py-4">
                Thanh toán
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500 py-4">
                Trạng thái
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500 py-4">
                Thời gian
              </TableHead>
              <TableHead className="py-4 pr-6 text-right w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-slate-50">
                  <TableCell className="pl-6">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="pr-6">
                    <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : recentOrders.length > 0 ? (
              recentOrders.slice(0, 6).map((order: any) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-slate-50/50 transition-colors border-slate-50"
                >
                  <TableCell className="py-4 pl-6">
                    <Link
                      href={`${ROUTES.ADMIN_ORDERS}/${order.id}`}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      {order.orderCode || `#${order.id}`}
                    </Link>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">
                        {order.user?.name ||
                          order.shippingSnapshot?.fullName ||
                          "Khách lẻ"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {order.user?.email || order.guestEmail || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-xs font-medium text-slate-600">
                      {order.orderItems?.length || 0} sản phẩm
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm font-semibold text-slate-900">
                      {formatCurrency(order.total)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-slate-100 text-slate-500 border border-slate-200">
                      {order.paymentMethod || "CASH"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div
                      className={`text-[10px] font-medium px-2.5 py-1 rounded-full inline-block ${STATUS_MAP[order.status]?.bg} ${STATUS_MAP[order.status]?.color}`}
                    >
                      {STATUS_MAP[order.status]?.label || order.status}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-xs text-slate-500">
                    {dayjs(order.createdAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-300 hover:text-slate-600 rounded-full"
                      asChild
                    >
                      <Link href={`${ROUTES.ADMIN_ORDERS}/${order.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-slate-400 italic text-sm"
                >
                  Chưa có đơn hàng nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
