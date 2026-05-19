"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Plus, RefreshCcw, Image as ImageIcon } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

interface BannerListHeaderProps {
  totalBanners: number;
  onRefresh: () => void;
  isFetching?: boolean;
}

export function BannerListHeader({ totalBanners, onRefresh, isFetching }: BannerListHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý Banner</h1>
          <p className="text-slate-500 text-sm">
            Quản lý các hình ảnh quảng bá và chiến dịch hiển thị trên trang chủ.
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
            {isFetching ? <Spinner size="sm" /> : <RefreshCcw className="h-3.5 w-3.5" />}
            Làm mới
          </Button>
          <Button asChild size="sm" className="h-9 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-wider gap-2 px-4 shadow-sm">
            <Link href={ROUTES.ADMIN_BANNERS_CREATE}>
              <Plus className="h-4 w-4" /> Thêm Banner
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
