"use client";

import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/Sheet";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function CartDrawer() {
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-full text-slate-600 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer">
          <ShoppingCart className="h-7 w-7" />
          {totalCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-md border-2 border-white">
              {totalCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>Giỏ hàng ({totalCount})</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/20" />
              <p className="text-muted-foreground">Giỏ hàng của bạn đang trống</p>
              <Button asChild variant="outline">
                <Link href={ROUTES.HOME}>Tiếp tục mua sắm</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 border-b pb-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                      <p className="text-sm font-bold">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <SheetFooter className="flex-col border-t pt-4 sm:flex-col">
            <div className="flex w-full items-center justify-between mb-4">
              <span className="text-base font-medium">Tổng cộng:</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(totalPrice())}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full">
              <Button asChild className="w-full rounded-full h-12">
                <Link href={ROUTES.CHECKOUT}>Thanh toán ngay</Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-full h-12">
                <Link href={ROUTES.CART}>Xem chi tiết giỏ hàng</Link>
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
