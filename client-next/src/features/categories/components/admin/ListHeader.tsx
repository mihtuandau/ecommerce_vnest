"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Plus, RefreshCcw, FolderTree } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

interface CategoryListHeaderProps {
  totalCategories: number;
  onRefresh: () => void;
  isFetching?: boolean;
}

export function CategoryListHeader({ totalCategories, onRefresh, isFetching }: CategoryListHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Danh mục sản phẩm</h1>
          <p className="text-slate-500 text-sm">
            Tổ chức và quản lý cấu trúc phân loại sản phẩm của cửa hàng.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-9 rounded-lg border-slate-200 font-bold text-xs uppercase tracking-wider gap-2 bg-white"
          >
            <RefreshCcw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
            Làm mới
          </Button>
          <Button asChild size="sm" className="h-9 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-wider gap-2 px-4 shadow-sm">
            <Link href="/admin/categories/create">
              <Plus className="h-4 w-4" /> Thêm danh mục
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
