"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Order, OrderItem } from "@/types/models";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import {
  MoreHorizontal,
  Eye,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import dayjs from "@/lib/dayjs";
import { OrderStatus, PaymentStatus } from "@/types/enums";
import { ADMIN_ORDER_STATUS_CONFIG } from "../../constants";

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
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex flex-col min-w-[130px]">
          <Link
            href={`${ROUTES.ADMIN_ORDERS}/${order.id}`}
            className="font-semibold text-slate-800 font-mono hover:text-primary transition-colors text-[12.5px]"
          >
            #{row.getValue("orderCode")}
          </Link>
          <span className="text-[11px] text-slate-500 mt-0.5">
            {dayjs(order.createdAt).format("DD/MM/YYYY · HH:mm")}
          </span>
        </div>
      );
    },
  },
  {
    id: "products",
    header: "Sản phẩm",
    cell: ({ row }) => {
      const order = row.original;
      const items = order.orderItems || [];
      const visibleItems = items.slice(0, 3);
      const remainingCount = items.length - 3;

      if (items.length === 0) return <span className="text-slate-400">--</span>;

      return (
        <div className="flex flex-col gap-1 py-1 cursor-pointer" onClick={() => window.location.href = `${ROUTES.ADMIN_ORDERS}/${order.id}`}>
          <div className="flex -space-x-2">
            {visibleItems.map((item: any, idx: number) => (
              <div key={idx} className="h-8 w-7 rounded border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative shadow-sm ring-2 ring-white">
                <Image
                  src={getImageUrl(item)}
                  alt="Product"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="h-8 w-7 rounded border border-slate-200 bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500 shadow-sm ring-2 ring-white z-10">
                +{remainingCount}
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-500 mt-1">{items.length} sản phẩm</span>
        </div>
      );
    },
  },
  {
    accessorKey: "shippingAddress",
    header: "Khách hàng",
    cell: ({ row }) => {
      const order = row.original;
      const name = order.shippingSnapshot?.fullName || order.user?.name || "Khách vãng lai";
      const phone = order.shippingSnapshot?.phone || (order as any).guestPhone || order.user?.phone || "--";
      const email = order.shippingSnapshot?.email || (order as any).guestEmail || order.user?.email || "";
      const avatarInitial = name !== "Khách vãng lai" ? name.substring(0, 2).toUpperCase() : "KV";

      return (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[11px] font-bold shrink-0">
            {avatarInitial}
          </div>
          <div className="flex flex-col min-w-[120px]">
            <span className="text-[13px] font-semibold text-slate-800">{name}</span>
            <span className="text-[11px] text-slate-500">{email || phone}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Tổng tiền",
    cell: ({ row }) => {
      const order = row.original;
      const amount = order.total || (order as any).totalAmount || 0;
      const discount = (order as any).discountAmount || 0;
      return (
        <div className="flex flex-col">
          <span className="text-[14px] font-bold font-serif text-slate-800">{formatCurrency(amount)}</span>
          {discount > 0 && <span className="text-[11px] font-medium text-rose-500">-{formatCurrency(discount)}</span>}
        </div>
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
      const config = ADMIN_ORDER_STATUS_CONFIG[status] || {
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
