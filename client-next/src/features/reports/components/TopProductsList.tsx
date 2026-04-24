"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatCurrency";
import { ShoppingBag, TrendingUp, Star, Loader2 } from "lucide-react";
import { useTopProducts } from "../hooks";

export function TopProductsList() {
  const { data: reportData, isLoading } = useTopProducts({ limit: 5 });

  const products = reportData?.data || [];
  if (isLoading) {
    return (
      <Card className="border-slate-200 shadow-sm overflow-hidden h-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <CardHeader className="p-7 border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest">
            Sản phẩm bán chạy
          </CardTitle>
          <p className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-wider">
            Top 5 sản phẩm doanh thu cao nhất
          </p>
        </div>
        <TrendingUp className="h-5 w-5 text-emerald-500" />
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="divide-y divide-slate-100">
          {products.map((product: any) => (
            <div
              key={product.productId}
              className="p-5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors group"
            >
              <div className="h-12 w-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 shrink-0">
                <img
                  src={product.image || "https://placehold.co/100x100?text=No+Img"}
                  alt={product.productName}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">
                  {product.productName}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <ShoppingBag className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      {product.totalQuantity} đã bán
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-slate-900 tracking-tight">
                  {formatCurrency(product.totalRevenue)}
                </p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">
                  Xu hướng tăng
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
