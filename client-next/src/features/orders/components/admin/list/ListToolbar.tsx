"use client";

import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OrderStatus, PaymentMethod } from "@/types/enums";

interface OrderListToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  paymentFilter: string;
  onPaymentChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  onReset: () => void;
}

export function OrderListToolbar({ 
  searchTerm, 
  onSearchChange,
  statusFilter,
  onStatusChange,
  paymentFilter,
  onPaymentChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onReset
}: OrderListToolbarProps) {
  return (
    <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] w-full md:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input 
          placeholder="Tìm mã đơn, tên khách, SĐT..." 
          className="w-full pl-9 pr-4 h-[36px] rounded-lg border border-slate-200 bg-white text-[13px] focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
        {/* Status Filter */}
        <select 
          className="h-[36px] px-3 border border-slate-200 rounded-lg text-[13px] bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-800 min-w-[150px] shadow-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5H7z%22%20fill%3D%22%2394a3b8%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_4px_center] pr-8"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value={OrderStatus.PENDING}>Chờ xác nhận</option>
          <option value={OrderStatus.PROCESSING}>Đang xử lý</option>
          <option value={OrderStatus.SHIPPED}>Đang giao hàng</option>
          <option value={OrderStatus.DELIVERED}>Đã giao hàng</option>
          <option value={OrderStatus.CANCELLED}>Đã hủy</option>
          <option value={OrderStatus.RETURN_REQUESTED}>Yêu cầu trả hàng</option>
        </select>

        {/* Payment Filter */}
        <select 
          className="h-[36px] px-3 border border-slate-200 rounded-lg text-[13px] bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-800 min-w-[150px] shadow-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5H7z%22%20fill%3D%22%2394a3b8%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_4px_center] pr-8"
          value={paymentFilter}
          onChange={(e) => onPaymentChange(e.target.value)}
        >
          <option value="ALL">Tất cả thanh toán</option>
          <option value={PaymentMethod.CASH}>Thanh toán khi nhận hàng (COD)</option>
          <option value={PaymentMethod.VNPAY}>Thanh toán VNPay</option>
          <option value={PaymentMethod.PAYOS}>Thanh toán PayOS</option>
        </select>

        {/* Date Filter */}
        <div className="flex items-center gap-2 h-[36px] px-3 border border-slate-200 rounded-lg bg-white shadow-sm text-slate-600 text-[13px]">
          <input 
            type="date" 
            className="bg-transparent border-none outline-none focus:ring-0 text-slate-600 cursor-pointer"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)} 
          />
          <span className="text-slate-300">—</span>
          <input 
            type="date" 
            className="bg-transparent border-none outline-none focus:ring-0 text-slate-600 cursor-pointer" 
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>

        <Button 
          variant="outline" 
          className="h-[36px] px-3 text-[13px] border-slate-200 shadow-sm bg-white hover:bg-slate-50 text-slate-600"
          onClick={onReset}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
