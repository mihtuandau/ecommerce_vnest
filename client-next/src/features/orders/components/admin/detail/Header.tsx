"use client";

import React from "react";
import dayjs from "@/lib/dayjs";
import { ChevronLeft, Printer, Share2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/DropdownMenu";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";
import { OrderStatus, PaymentStatus } from "@/types/enums";

interface HeaderProps {
  order: any;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  id: string;
}

export function Header({ order, onUpdateStatus, id }: HeaderProps) {
  const router = useRouter();
  const isCancelled = order.status === OrderStatus.CANCELLED;
  const orderAny = order as any;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          className="h-9 w-9 p-0 rounded-lg border border-slate-200"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">Chi tiết đơn hàng #{order.orderCode}</h1>
            {isCancelled && (
              <Badge variant="outline" className="rounded-full px-3 py-1.5 text-[11px] font-medium bg-rose-50 text-rose-600 border-none h-fit leading-none flex items-center justify-center">
                Đã hủy
              </Badge>
            )}
            {order.status === OrderStatus.RETURN_REQUESTED && (
              <Badge variant="outline" className="rounded-full px-3 py-1.5 text-[11px] font-medium bg-amber-50 text-amber-600 border-none h-fit leading-none flex items-center justify-center">
                Yêu cầu trả hàng
              </Badge>
            )}
            {order.status === OrderStatus.RETURNED && (
              <Badge variant="outline" className="rounded-full px-3 py-1.5 text-[11px] font-medium bg-purple-50 text-purple-600 border-none h-fit leading-none flex items-center justify-center">
                Đã trả hàng
              </Badge>
            )}
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Ngày đặt: {dayjs(order.createdAt).format("HH:mm, DD/MM/YYYY")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 no-print">
        <Button 
          variant="outline" 
          size="sm" 
          className="font-semibold gap-2 border-slate-200"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4" /> In đơn
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="font-semibold gap-2 border-slate-200">
              Thao tác khác
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-lg">
            <DropdownMenuItem className="text-sm font-medium py-2">
              <Share2 className="h-4 w-4 mr-2" /> Chia sẻ
            </DropdownMenuItem>
            {!isCancelled && (
              <DropdownMenuItem 
                className="text-sm font-medium py-2 text-rose-600"
                onClick={() => onUpdateStatus(id, OrderStatus.CANCELLED)}
              >
                <XCircle className="h-4 w-4 mr-2" /> Hủy đơn
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
