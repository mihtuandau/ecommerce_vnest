"use client";

import React from "react";
import Link from "next/link";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants/routes";
import { adminUI } from "@/constants/admin-ui";
import { cn } from "@/utils/cn";

interface CategoryListHeaderProps {
  totalCategories: number;
  onRefresh: () => void;
  isFetching?: boolean;
}

export function CategoryListHeader({
  totalCategories,
  onRefresh,
  isFetching,
}: CategoryListHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className={adminUI.typography.heading}>Quản lý danh mục</h1>
        <div className="mt-1 flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
          <span>Sản phẩm</span>
          <span className="text-[10px]">/</span>
          <span className="text-slate-800">{totalCategories} danh mục</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className={cn(adminUI.button.base, adminUI.button.ghost)}
        >
          {isFetching ? (
            <Spinner size="sm" />
          ) : (
            <RefreshCw className={adminUI.icon.action} />
          )}
          {isFetching ? "Đang tải..." : "Làm mới"}
        </Button>

        <Button
          asChild
          size="sm"
          className={cn(adminUI.button.base, adminUI.button.primary)}
        >
          <Link href={ROUTES.ADMIN_CATEGORIES_CREATE}>
            <Plus className={adminUI.icon.action} /> Thêm danh mục
          </Link>
        </Button>
      </div>
    </div>
  );
}
