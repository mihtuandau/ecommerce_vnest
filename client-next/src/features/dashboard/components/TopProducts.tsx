"use client";

import { Star, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";
import { Skeleton } from "@/components/ui/Skeleton";

interface TopProductsProps {
  products: any[];
  isLoading: boolean;
}

export function TopProducts({ products, isLoading }: TopProductsProps) {
  const topProducts = Array.isArray(products) ? products : [];

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white h-full transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-4 px-6 border-b border-slate-50">
        <CardTitle className="text-base font-semibold text-slate-900">
          Top sản phẩm bán chạy
        </CardTitle>
        <Button
          variant="link"
          className="text-primary font-medium text-sm flex items-center gap-1 hover:no-underline p-0"
          asChild
        >
          <Link href={ROUTES.ADMIN_PRODUCTS}>
            Xem tất cả <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/30">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="text-[11px] font-medium text-slate-500 py-4 pl-6 w-[50px]">
                #
              </TableHead>
              <TableHead className="text-[11px] font-medium text-slate-500 py-4 w-[45%]">
                Sản phẩm
              </TableHead>
              <TableHead className="text-[11px] font-medium text-slate-500 py-4 text-center">
                Đã bán
              </TableHead>
              <TableHead className="text-[11px] font-medium text-slate-500 py-4 text-right">
                Doanh thu
              </TableHead>
              <TableHead className="text-[11px] font-medium text-slate-500 py-4 pr-6 text-right w-[100px]">
                Đánh giá
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-slate-50">
                  <TableCell className="pl-6"><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell className="pr-6"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : topProducts.length > 0 ? (
              topProducts.map((item: any, index: number) => (
                <TableRow key={index} className="hover:bg-slate-50/50 transition-colors border-slate-50 group">
                  <TableCell className="py-4 pl-6 text-xs font-medium text-slate-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                            IMG
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-slate-900 truncate max-w-[350px] group-hover:text-primary transition-colors">
                          {item.productName}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <span className="text-sm font-medium text-slate-700">
                      {item.totalQuantity || 0}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      {formatCurrency(item.totalRevenue || 0)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Star className={cn("h-3 w-3", (item.rating > 0) ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                      <span className="text-sm font-medium text-slate-700">
                        {item.rating > 0 ? item.rating.toFixed(1) : "0.0"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-400 italic text-sm">
                  Chưa có dữ liệu sản phẩm
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
