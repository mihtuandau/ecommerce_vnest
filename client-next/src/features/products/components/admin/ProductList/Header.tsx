"use client";

import React from "react";
import { RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { adminUI } from "@/constants/admin-ui";

interface HeaderProps {
  totalProducts: number;
  onRefresh: () => void;
  isFetching: boolean;
  className?: string;
}

export function Header({ totalProducts, onRefresh, isFetching, className }: HeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4", className)}>
      <div>
        <h1 className={adminUI.typography.heading}>
          Quản lý sản phẩm
        </h1>
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 mt-1">
          <span>Sản phẩm</span>
          <span className="text-[10px]">›</span>
          <span className="text-slate-800">Danh sách sản phẩm</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(adminUI.button.base, adminUI.button.ghost)}
          onClick={onRefresh}
          disabled={isFetching}
        >
          {isFetching ? <Spinner size="sm" /> : <RefreshCw className={adminUI.icon.action} />}
          {isFetching ? "Đang tải..." : "Làm mới"}
        </Button>
        <Button
          asChild
          size="sm"
          className={cn(adminUI.button.base, adminUI.button.primary)}
        >
          <Link href={`${ROUTES.ADMIN_PRODUCTS}/create`}>
            <Plus className={adminUI.icon.action} /> Thêm sản phẩm
          </Link>
        </Button>
      </div>
    </div>
  );
}
