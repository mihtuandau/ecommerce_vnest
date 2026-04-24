"use client";

import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Card, CardContent } from "@/components/ui/Card";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container py-20">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Giỏ hàng của bạn đang trống</h1>
            <p className="text-muted-foreground">Có vẻ như bạn chưa chọn được sản phẩm nào ưng ý.</p>
          </div>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href={ROUTES.HOME}>Khám phá ngay</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 lg:py-16">
      <div className="container">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Giỏ hàng của bạn</h1>
            <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => clearCart()}>
              Xóa tất cả
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <Card key={item.productId} className="overflow-hidden border-none shadow-sm bg-card/50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl border bg-white">
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <Link href={`/${item.slug}`} className="font-bold text-lg hover:text-primary transition-colors line-clamp-2">
                              {item.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">ID: {item.productId.slice(0, 8)}</p>
                          </div>
                          <p className="text-xl font-bold text-primary">{formatCurrency(item.price)}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border rounded-full bg-background p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center font-bold">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 rounded-full"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button asChild variant="ghost" className="gap-2">
                <Link href={ROUTES.HOME}><ArrowLeft className="h-4 w-4" /> Tiếp tục mua sắm</Link>
              </Button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-4">
              <Card className="sticky top-24 border-none shadow-lg overflow-hidden">
                <div className="bg-primary/5 p-6 border-b">
                  <h3 className="font-bold text-lg">Tóm tắt đơn hàng</h3>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính ({items.length} sản phẩm)</span>
                    <span className="font-medium">{formatCurrency(totalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span className="text-green-600 font-medium">Miễn phí</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold">Tổng cộng</span>
                    <div className="text-right">
                      <p className="text-2xl font-black text-primary">{formatCurrency(totalPrice())}</p>
                      <p className="text-[10px] text-muted-foreground">(Đã bao gồm VAT nếu có)</p>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full h-14 rounded-full text-lg shadow-lg shadow-primary/20 mt-4">
                    <Link href={ROUTES.CHECKOUT}>Tiến hành thanh toán</Link>
                  </Button>
                  
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Hàng chính hãng 100%</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>Bảo mật thông tin thanh toán</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
