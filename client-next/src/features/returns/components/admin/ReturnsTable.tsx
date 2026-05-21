"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";
import { RETURN_STATUS_CONFIG } from "../../constants/index";
import { ReturnStatus } from "@/types/enums";
import {
  RotateCcw,
  Calendar,
  ArrowUpRight,
  Eye,
} from "lucide-react";

interface ReturnsTableProps {
  returns: any[];
  isLoading: boolean;
}

export function ReturnsTable({ returns, isLoading }: ReturnsTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-slate-200">
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-4 h-12 bg-slate-50/50">
              Đơn hàng
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 bg-slate-50/50">
              Khách hàng
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 bg-slate-50/50">
              Lý do
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 bg-slate-50/50">
              Giá trị
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 bg-slate-50/50">
              Ngày yêu cầu
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 bg-slate-50/50">
              Trạng thái
            </TableHead>
            <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pr-6 h-12 bg-slate-50/50">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Spinner size="lg" />
                  <p className="text-xs font-medium text-slate-400">
                    Đang tải dữ liệu...
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : returns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                    <RotateCcw size={28} />
                  </div>
                  <p className="text-xs font-medium text-slate-400">
                    Không tìm thấy yêu cầu nào
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            returns.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-slate-50/50 transition-colors border-slate-100"
              >
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">
                      #{item.order?.orderCode}
                    </span>
                    <Link
                      href={`/admin/orders/${item.orderId}`}
                      className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium mt-0.5"
                    >
                      Chi tiết đơn <ArrowUpRight size={10} />
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-700">
                      {item.user?.name}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {item.user?.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className="text-xs text-slate-600 font-medium line-clamp-1 max-w-[200px]"
                    title={item.reason}
                  >
                    {item.reason}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-semibold text-slate-800">
                    {formatCurrency(item.order?.total)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar size={13} />
                    <span className="text-xs font-medium">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-lg px-2 py-1 font-semibold text-[11px] border",
                      RETURN_STATUS_CONFIG[item.status as ReturnStatus]?.color
                    )}
                  >
                    {RETURN_STATUS_CONFIG[item.status as ReturnStatus]?.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/returns/${item.id}`}>
                      <button className="h-9 px-4 rounded-xl text-slate-600  font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
                        <Eye size={14} />
                      </button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
