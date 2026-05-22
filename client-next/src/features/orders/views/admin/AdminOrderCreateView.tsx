"use client";

import React from "react";
import { AdminOrderForm } from "../../components/admin/create/OrderForm";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function AdminOrderCreateView() {
  return (
    <div className="space-y-4 pb-4">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Link
              href={ROUTES.ADMIN_ORDERS}
              className="hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
            >
              <ChevronLeft className="h-3 w-3" />
              Đơn hàng
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              Tạo đơn mới
            </h1>
          </div>
        </div>
      </div>

      
      <AdminOrderForm />
    </div>
  );
}
