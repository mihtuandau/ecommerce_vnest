"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types/models";
import { DataTable } from "@/components/ui/DataTable";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";
import {
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Package,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Badge } from "@/components/ui/Badge";
import { useUpdateOrderStatus } from "../../hooks";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import dayjs from "@/lib/dayjs";
import { OrderStatus, PaymentStatus } from "@/types/enums";

export const columns: ColumnDef<Order>[] = [
  {
    id: "stt",
    header: "STT",
    cell: ({ row }) => (
      <span className="text-slate-400 font-medium">
        {row.index + 1}
      </span>
    ),
  },
  {
    accessorKey: "orderCode",
    header: "Mã đơn",
    cell: ({ row }) => (
      <Link 
        href={`${ROUTES.ADMIN_ORDERS}/${row.original.id}`}
        className="font-bold text-primary hover:underline"
      >
        #{row.getValue("orderCode")}
      </Link>
    ),
  },
  {
    accessorKey: "shippingAddress",
    header: "Khách hàng",
    cell: ({ row }) => {
      const order = row.original as any;
      const name = order.shippingSnapshot?.fullName || order.user?.name || "Khách vãng lai";
      const phone = order.shippingSnapshot?.phone || order.guestPhone || order.user?.phone || "--";

      return (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{name}</span>
          <span className="text-xs text-slate-500">{phone}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Tổng tiền",
    cell: ({ row }) => {
      const order = row.original as any;
      const amount = order.total || order.totalAmount || 0;
      return (
        <span className="font-bold text-slate-900">
          {formatCurrency(amount)}
        </span>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Thanh toán",
    cell: ({ row }) => {
      const order = row.original as any;
      const paymentStatus = order.paymentStatus || order.payment?.status || PaymentStatus.PENDING;
      const isPaid = paymentStatus === "PAID" || paymentStatus === PaymentStatus.SUCCESS;
      
      return (
        <Badge 
          variant="outline" 
          className={cn(
            "text-[10px] font-bold px-3 py-1 rounded-full h-fit leading-none flex items-center justify-center",
            isPaid 
              ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
              : "bg-amber-50 text-amber-600 border-amber-200"
          )}
        >
          {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus;
      const statusMap: Record<OrderStatus, { label: string; class: string }> = {
        [OrderStatus.PENDING]: { label: "Chờ xử lý", class: "bg-slate-100 text-slate-600 border-slate-200" },
        [OrderStatus.PROCESSING]: { label: "Đang xử lý", class: "bg-blue-50 text-blue-600 border-blue-200" },
        [OrderStatus.SHIPPED]: { label: "Đang giao", class: "bg-indigo-50 text-indigo-600 border-indigo-200" },
        [OrderStatus.DELIVERED]: { label: "Đã giao", class: "bg-emerald-50 text-emerald-600 border-emerald-200" },
        [OrderStatus.CANCELLED]: { label: "Đã hủy", class: "bg-rose-50 text-rose-600 border-rose-200" },
      };

      const config = statusMap[status] || { label: status, class: "bg-slate-100 text-slate-600" };

      return (
        <Badge
          variant="outline"
          className={cn("rounded-full px-3 py-1.5 font-medium text-[11px] h-fit leading-none flex items-center justify-center", config.class)}
        >
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày đặt",
    cell: ({ row }) => (
      <span className="text-slate-500 text-xs">
        {dayjs(row.getValue("createdAt")).format("DD/MM/YYYY HH:mm")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-md"
            asChild
          >
            <Link href={`${ROUTES.ADMIN_ORDERS}/${order.id}`}>
              <Eye className="h-4 w-4 text-slate-400" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

interface OrderTableProps {
  data: Order[];
}

export function OrderTable({ data }: OrderTableProps) {
  return (
    <DataTable columns={columns} data={data} searchKey="orderCode" hideSearch={true} />
  );
}
