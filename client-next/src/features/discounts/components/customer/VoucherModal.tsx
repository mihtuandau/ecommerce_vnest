import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { discountsApi } from "@/features/discounts/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { Tag, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { CheckoutDiscount } from "@/store/useCartStore";

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (code: string) => void;
  isApplying: boolean;
  appliedCode?: string;
  cartTotal: number;
}

export function VoucherModal({ isOpen, onClose, onApply, isApplying, appliedCode, cartTotal }: VoucherModalProps) {
  const [inputCode, setInputCode] = useState("");
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      discountsApi.getDiscounts()
        .then((res) => {
          setVouchers(res.data.filter(d => d.isActive));
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  const handleApply = (code: string) => {
    if (!code) return;
    onApply(code.toUpperCase());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-slate-50 border-none rounded-3xl">
        <DialogHeader className="p-6 bg-white border-b border-slate-100">
          <DialogTitle className="text-xl font-bold text-slate-900 text-center">Chọn Voucher</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Input field */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập mã giảm giá..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            />
            <Button 
              onClick={() => handleApply(inputCode)}
              disabled={!inputCode || isApplying}
              className="h-[46px] px-6 rounded-xl font-bold shadow-sm"
            >
              {isApplying && inputCode ? <Spinner size="sm" variant="white" /> : "Áp dụng"}
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700">Mã có thể áp dụng</h3>
            
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Spinner size="md" />
              </div>
            ) : vouchers.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {vouchers.map(v => {
                  const isPercentage = v.type === 'PERCENTAGE' || !!v.percentage;
                  const discountVal = v.value || v.percentage || v.fixedAmount || 0;
                  const minOrder = v.minOrderAmount || v.minOrderValue || 0;
                  const maxDiscount = v.maxDiscountAmount || v.maxDiscount || 0;

                  const isEligible = !minOrder || cartTotal >= (Number(minOrder) || 0);
                  const isApplied = appliedCode === v.code;
                  
                  return (
                    <div 
                      key={v.id} 
                      className={cn(
                        "p-4 rounded-2xl border transition-all relative overflow-hidden",
                        isApplied ? "border-primary bg-primary/5" : "bg-white border-slate-200 hover:border-slate-300",
                        !isEligible && "opacity-60 cursor-not-allowed bg-slate-50"
                      )}
                    >
                      {/* Decoration circle */}
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 border-r border-slate-200/50" />
                      
                      <div className="flex gap-4 items-center pl-4">
                        <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                          <Tag className="h-5 w-5 text-emerald-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 mb-0.5">{v.code}</div>
                          <div className="text-xs font-medium text-slate-500">
                            Giảm {isPercentage ? `${discountVal}%` : formatCurrency(Number(discountVal) || 0)}
                            {maxDiscount > 0 ? ` tối đa ${formatCurrency(Number(maxDiscount) || 0)}` : ''}
                          </div>
                          {Number(minOrder) > 0 && (
                            <div className="text-[10px] text-slate-400 mt-1">Đơn tối thiểu {formatCurrency(Number(minOrder) || 0)}</div>
                          )}
                        </div>
                        
                        <Button
                          variant={isApplied ? "default" : "outline"}
                          size="sm"
                          disabled={!isEligible || isApplying}
                          onClick={() => handleApply(v.code)}
                          className={cn(
                            "rounded-full px-4 text-xs font-bold shrink-0",
                            isApplied && "bg-primary text-white"
                          )}
                        >
                          {isApplying && inputCode === v.code ? (
                            <Spinner size="sm" />
                          ) : isApplied ? (
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Đã chọn</span>
                          ) : (
                            "Dùng ngay"
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 border-dashed">
                <Tag className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-500">Không có mã giảm giá nào</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
