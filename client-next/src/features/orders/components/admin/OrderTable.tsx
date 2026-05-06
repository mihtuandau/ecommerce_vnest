"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order, OrderItem } from "@/types/models";
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
      <span className="text-xs font-semibold text-slate-500">{row.index + 1}</span>
    ),
  },
  {
    accessorKey: "orderCode",
    header: "Mã đơn",
    cell: ({ row }) => (
      <Link
        href={`${ROUTES.ADMIN_ORDERS}/${row.original.id}`}
        className="font-semibold text-primary hover:underline"
      >
        #{row.getValue("orderCode")}
      </Link>
    ),
  },
  {
    id: "products",
    header: "Sản phẩm",
    cell: ({ row }) => {
      const order = row.original;
      const firstItem = order.orderItems?.[0];
      const otherItemsCount = (order.orderItems?.length || 1) - 1;

      if (!firstItem) return <span className="text-slate-400">--</span>;

      // Safe image resolver - try multiple sources
      const getImageUrl = (item: OrderItem) => {
        const normalize = (path: string) => {
          if (!path) return "";
          if (path.startsWith("http")) return path;
          return `/${path.replace(/\\/g, "/").replace(/^\//, "")}`;
        };

        // 1. Try variantSnapshot (saved at order time)
        const snapshotImg = (item.variantSnapshot as { image?: string; imageUrl?: string })?.image || (item.variantSnapshot as { image?: string; imageUrl?: string })?.imageUrl;
        if (snapshotImg && typeof snapshotImg === "string" && snapshotImg.length > 5) {
          return normalize(snapshotImg);
        }

        // 2. Try variant's own images
        const variantImages = item.variant?.images || [];
        if (variantImages.length > 0) {
          const url =
            typeof variantImages[0] === "string"
              ? variantImages[0]
              : variantImages[0]?.url;
          if (url) return normalize(url);
        }

        // 3. Try product images
        const productImages = item.variant?.product?.images || [];
        if (productImages.length > 0) {
          const url =
            typeof productImages[0] === "string"
              ? productImages[0]
              : productImages[0]?.url;
          if (url) return normalize(url);
        }

        // 4. Fallback
        return "/placeholder.png";
      };

      const imageUrl = getImageUrl(firstItem);

      return (
        <div className="flex items-center gap-3 py-1">
          <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden p-0.5 flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Product"
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col min-w-0 max-w-[200px]">
            <span className="text-xs font-semibold text-slate-800 truncate">
              {firstItem.productName || firstItem.variant?.product?.name}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              {(firstItem.variant?.color || firstItem.variant?.size) && (
                <span className="text-[11px] text-primary font-semibold tracking-tight bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                  {[firstItem.variant?.color, firstItem.variant?.size]
                    .filter(Boolean)
                    .join(" / ")}
                </span>
              )}
              {otherItemsCount > 0 && (
                <span className="text-[11px] text-slate-500 font-semibold">
                  +{otherItemsCount} sản phẩm khác
                </span>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "shippingAddress",
    header: "Khách hàng",
    cell: ({ row }) => {
      const order = row.original;
      const name =
        order.shippingSnapshot?.fullName || order.user?.name || "Khách vãng lai";
      const phone =
        order.shippingSnapshot?.phone || order.guestPhone || order.user?.phone || "--";

      return (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">{name}</span>
          <span className="text-xs text-slate-600">{phone}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Tổng tiền",
    cell: ({ row }) => {
      const order = row.original;
      const amount = order.total || order.totalAmount || 0;
      return (
        <span className="font-semibold text-slate-800">{formatCurrency(amount)}</span>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Thanh toán",
    cell: ({ row }) => {
      const order = row.original;
      const paymentStatus =
        order.paymentStatus || order.payment?.status || PaymentStatus.PENDING;
      const isPaid =
        paymentStatus === "PAID" || paymentStatus === PaymentStatus.SUCCESS;
      const isRefunded =
        paymentStatus === "REFUNDED" || paymentStatus === PaymentStatus.REFUNDED;
      const isCancelled =
        paymentStatus === "CANCELLED" || paymentStatus === PaymentStatus.CANCELLED;

      return (
        <Badge
          variant="outline"
          className={cn(
            "text-[11px] font-semibold px-2.5 py-1 rounded-full h-fit leading-none flex items-center justify-center border",
            isPaid
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : isRefunded
                ? "bg-purple-50 text-purple-600 border-purple-200"
                : isCancelled
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "bg-amber-50 text-amber-600 border-amber-200"
          )}
        >
          {isPaid
            ? "Đã thanh toán"
            : isRefunded
              ? "Đã hoàn tiền"
              : isCancelled
                ? "Đã hủy"
                : "Chưa thanh toán"}
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
        [OrderStatus.PENDING]: {
          label: "Chờ xử lý",
          class: "bg-slate-100 text-slate-600 border-slate-200",
        },
        [OrderStatus.PROCESSING]: {
          label: "Đang xử lý",
          class: "bg-blue-50 text-blue-600 border-blue-200",
        },
        [OrderStatus.SHIPPED]: {
          label: "Đang giao",
          class: "bg-indigo-50 text-indigo-600 border-indigo-200",
        },
        [OrderStatus.DELIVERED]: {
          label: "Đã giao",
          class: "bg-emerald-50 text-emerald-600 border-emerald-200",
        },
        [OrderStatus.CANCELLED]: {
          label: "Đã hủy",
          class: "bg-rose-50 text-rose-600 border-rose-200",
        },
        [OrderStatus.RETURN_REQUESTED]: {
          label: "Yêu cầu trả hàng",
          class: "bg-amber-50 text-amber-600 border-amber-200",
        },
        [OrderStatus.RETURNED]: {
          label: "Đã trả hàng",
          class: "bg-purple-50 text-purple-600 border-purple-200",
        },
      };

      const config = statusMap[status] || {
        label: status,
        class: "bg-slate-100 text-slate-600",
      };

      return (
        <Badge
          variant="outline"
          className={cn(
            "rounded-full px-2.5 py-1 font-semibold text-[11px] h-fit leading-none flex items-center justify-center border",
            config.class
          )}
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
      <span className="text-slate-600 text-xs font-medium">
        {dayjs(row.getValue("createdAt")).format("DD/MM/YYYY HH:mm")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const order = row.original;
      const meta = table.options.meta as { onUpdateStatus?: (id: string, status: OrderStatus) => void };
      const onUpdateStatus = meta?.onUpdateStatus;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-md">
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-lg p-1">
              <DropdownMenuLabel className="text-[11px] font-semibold tracking-wide text-slate-500 px-2 py-1.5">
                Thao tác
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="rounded-md cursor-pointer gap-2 py-2"
                asChild
              >
                <Link href={`${ROUTES.ADMIN_ORDERS}/${order.id}`}>
                  <Eye className="h-4 w-4 text-slate-500" />
                  Xem chi tiết
                </Link>
              </DropdownMenuItem>
              {order.status !== OrderStatus.CANCELLED &&
                order.status !== OrderStatus.RETURNED &&
                order.status !== OrderStatus.DELIVERED && (
                  <DropdownMenuItem
                    className="rounded-md cursor-pointer gap-2 py-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                    onClick={() => {
                      if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
                        onUpdateStatus?.(String(order.id), OrderStatus.CANCELLED);
                      }
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                    Hủy đơn hàng
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

interface OrderTableProps {
  data: Order[];
  onUpdateStatus?: (id: string, status: OrderStatus) => void;
}

export function OrderTable({ data, onUpdateStatus }: OrderTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="orderCode"
      hideSearch={true}
      meta={{ onUpdateStatus }}
    />
  );
}
