"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function EmptyCart() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-md mx-auto text-center space-y-6 p-10 bg-white rounded-3xl border border-slate-100">
          <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-slate-300" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-slate-900">Giỏ hàng trống</h1>
            <p className="text-slate-500 text-sm">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
          </div>
          <Button asChild size="lg" className="w-full h-12 rounded-xl bg-primary hover:bg-[#0d47a1] text-white shadow-lg shadow-primary/10 transition-all font-medium text-sm">
            <Link href={ROUTES.HOME}>Khám phá ngay</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
