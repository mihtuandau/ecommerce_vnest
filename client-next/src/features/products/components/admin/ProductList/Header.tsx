"use client";

import React from "react";
import { RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface HeaderProps {
  totalProducts: number;
  onRefresh: () => void;
  isFetching: boolean;
}

export function Header({ totalProducts, onRefresh, isFetching }: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Quản lý sản phẩm
        </h1>
        <p className="text-slate-500 text-sm">
          Tổng cộng {totalProducts} sản phẩm trong hệ thống
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="font-bold gap-2 text-slate-500 hover:text-primary hover:bg-slate-50"
          onClick={onRefresh}
          disabled={isFetching}
        >
          <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          {isFetching ? "Đang tải..." : "Làm mới"}
        </Button>
        <Button
          asChild
          size="sm"
          className="font-bold gap-2 bg-primary text-white hover:bg-slate-800 shadow-sm"
        >
          <Link href={`${ROUTES.ADMIN_PRODUCTS}/create`}>
            <Plus className="h-4 w-4" /> Thêm sản phẩm
          </Link>
        </Button>
      </div>
    </div>
  );
}
