"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/utils/formatCurrency";

interface TopProductsProps {
  products: any[];
  isLoading: boolean;
}

export function TopProducts({ products, isLoading }: TopProductsProps) {
  return (
    <Card className="border border-slate-200 shadow-none rounded-xl overflow-hidden bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">
            Sản phẩm bán chạy
          </CardTitle>
          <CardDescription className="text-xs font-medium text-slate-600">
            Top 5 sản phẩm theo số lượng bán
          </CardDescription>
        </div>
        <Link
          href={ROUTES.ADMIN_PRODUCTS}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Tất cả sản phẩm
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-12 w-12 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 bg-muted rounded" />
                  <div className="h-2 w-20 bg-muted rounded" />
                </div>
              </div>
            ))
          ) : products?.length > 0 ? (
            products.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between group p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-0.5 line-clamp-1">
                      {item.productName}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {item.totalQuantity || 0} đã bán
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">
                    {formatCurrency(item.totalRevenue || 0)}
                  </p>
                  <div className="w-24 h-1.5 bg-slate-50 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-slate-400 rounded-full"
                      style={{
                        width: `${((item.totalRevenue || 0) / (products[0]?.totalRevenue || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground text-xs font-medium italic">
              Chưa có dữ liệu sản phẩm
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
