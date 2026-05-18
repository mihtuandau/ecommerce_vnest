"use client";

import React from "react";
import { Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface LogsToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  action: string;
  setAction: (val: string) => void;
  entityName: string;
  setEntityName: (val: string) => void;
  setPage: (val: number) => void;
  handleResetFilters: () => void;
}

export function LogsToolbar({
  search,
  setSearch,
  action,
  setAction,
  entityName,
  setEntityName,
  setPage,
  handleResetFilters,
}: LogsToolbarProps) {
  return (
    <Card className="border-slate-100 rounded-2xl shadow-xs bg-white overflow-hidden">
      <CardContent className="p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md group flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm kiếm theo nhân viên, ID hoặc hành động..."
            className="pl-10 h-11 bg-slate-50 border-slate-100 hover:border-slate-200 focus-visible:ring-indigo-600 focus-visible:bg-white rounded-xl text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Filter by Action */}
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={action}
              onChange={(e) => {
                setAction(e.target.value);
                setPage(1);
              }}
              className="h-11 px-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="">Tất cả Hành động</option>
              <option value="POST">POST (Tạo mới)</option>
              <option value="PATCH">PATCH (Cập nhật)</option>
              <option value="DELETE">DELETE (Xóa)</option>
            </select>
          </div>

          {/* Filter by Entity */}
          <select
            value={entityName}
            onChange={(e) => {
              setEntityName(e.target.value);
              setPage(1);
            }}
            className="h-11 px-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="">Tất cả Bảng</option>
            <option value="USERS">Người dùng</option>
            <option value="PRODUCTS">Sản phẩm</option>
            <option value="CATEGORIES">Danh mục</option>
            <option value="DISCOUNTS">Khuyến mãi</option>
            <option value="ORDERS">Đơn hàng</option>
            <option value="PAYMENTS">Thanh toán</option>
            <option value="SHIPPING">Vận chuyển</option>
            <option value="RETURNS">Đổi trả</option>
          </select>

          {(search || action || entityName) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-11 px-4 text-xs font-bold text-slate-500 hover:text-rose-600 rounded-xl hover:bg-rose-50/50 cursor-pointer"
              onClick={handleResetFilters}
            >
              Đặt lại
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
