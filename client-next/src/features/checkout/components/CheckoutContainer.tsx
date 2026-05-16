"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Truck, ChevronDown, ShoppingBag } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";

// Custom Hook
import { useCheckout } from "../hooks/useCheckout";

// Sub-components
import { ShippingForm } from "./ShippingForm";
import { PaymentMethods } from "./PaymentMethods";
import { OrderSummary } from "./OrderSummary";

export function CheckoutContainer() {
  const router = useRouter();
  const {
    mounted,
    displayItems,
    subtotal,
    shippingFee,
    isCalculatingFee,
    isSubmitting,
    discountCode,
    setDiscountCode,
    appliedDiscount,
    discountAmount,
    isApplyingDiscount,
    form,
    setForm,
    provinces,
    districts,
    wards,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    applySavedAddress,
    handleApplyDiscount,
    handleRemoveDiscount,
    handleSubmit,
    addressData,
    selectedAddressId,
    setSelectedAddressId,
    isLoadingDistricts,
    isLoadingWards,
    user,
    isBuyNow,
    itemsChangedNotice,
  } = useCheckout();

  if (!mounted) {
    return (
      <div className="bg-brand-cream min-h-screen pb-20 text-foreground font-sans-brand">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-9">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-48 bg-white rounded-xl" />
            <Skeleton className="h-6 w-32 bg-white rounded-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7">
            <div className="space-y-4">
              <Skeleton className="h-64 w-full bg-white rounded-[16px]" />
              <Skeleton className="h-48 w-full bg-white rounded-[16px]" />
            </div>
            <Skeleton className="h-[500px] w-full bg-white rounded-[16px]" />
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <h2 className="text-xl font-bold text-slate-900 mt-5">Đang xử lý đơn hàng</h2>
      </div>
    );
  }

  const isEmpty = displayItems.length === 0;

  return (
    <div className="bg-brand-cream min-h-screen pb-20 text-foreground font-sans-brand">
      {isEmpty ? (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
          <Truck className="h-16 w-16 text-slate-200 mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Chưa có sản phẩm nào</h1>
          <Button onClick={() => router.push("/shop")} className="rounded-xl px-10 h-12 font-bold">Quay lại cửa hàng</Button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-9">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-[32px] font-bold text-primary tracking-tight font-serif">Thanh toán</h1>
            <div className="flex items-center gap-1.5 text-[12.5px] text-brand-taupe">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Thanh toán bảo mật SSL
            </div>
          </div>

          {itemsChangedNotice && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <ShoppingBag size={16} />
              </div>
              <p className="text-[13px] text-amber-800 font-medium">
                Danh sách sản phẩm vừa được cập nhật do có thay đổi từ giỏ hàng của bạn.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 items-start">
            <div className="space-y-4">
              {/* 1. ĐỊA CHỈ ĐÃ LƯU */}
              {user && addressData?.addresses && addressData.addresses.length > 0 && (
                <div className="bg-white rounded-[16px] border border-brand-sand overflow-hidden shadow-sm">
                  <div className="px-6 py-[18px] border-b border-brand-sand flex items-center justify-between bg-brand-ivory/30">
                    <div className="flex items-center gap-[10px]">
                      <div className="w-[26px] h-[26px] rounded-full bg-primary flex items-center justify-center text-white text-[12px] font-bold">1</div>
                      <h2 className="text-[15px] font-bold text-primary uppercase tracking-tight">Địa chỉ đã lưu</h2>
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="text-[12.5px] font-bold text-brand-bronze hover:underline p-0 h-auto" onClick={() => router.push("/account?tab=address")}>Quản lý</Button>
                  </div>
                  <div className="p-6 space-y-[10px]">
                    {addressData.addresses.map((addr: any) => (
                      <div 
                        key={addr.id} 
                        onClick={() => applySavedAddress(addr)}
                        className={cn("p-4 rounded-[12px] border transition-all cursor-pointer flex items-start gap-3", selectedAddressId === addr.id ? "border-primary bg-brand-ivory ring-1 ring-primary/20" : "border-brand-sand hover:border-brand-bronze/30 hover:bg-brand-ivory")}
                      >
                        <input type="radio" checked={selectedAddressId === addr.id} readOnly className="mt-1 accent-primary" />
                        <div className="flex-1">
                          <div className="text-[13.5px] font-bold text-primary mb-1 flex items-center gap-2">
                            {addr.fullName}
                            {addr.isDefault && <span className="text-[10px] bg-brand-bronze/10 text-brand-bronze px-2 py-[2px] rounded-full font-bold uppercase tracking-tighter">Mặc định</span>}
                          </div>
                          <p className="text-[12.5px] text-brand-taupe line-clamp-2">
                            {addr.street}, {addr.ward}, {addr.district}, {addr.province}
                          </p>
                          <p className="text-[12.5px] text-brand-taupe mt-1.5 font-semibold">📞 {addr.phone}</p>
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => setSelectedAddressId(null)}
                      className={cn(
                        "flex items-center justify-center gap-2 text-[13px] border-[1.5px] border-dashed rounded-[10px] py-[11px] px-4 w-full transition-all font-bold mt-2",
                        selectedAddressId === null ? "border-primary bg-brand-ivory text-primary shadow-sm" : "border-brand-sand text-brand-bronze hover:bg-brand-ivory hover:border-brand-bronze"
                      )}
                    >
                      <span className="text-[18px]">+</span> Nhập địa chỉ mới
                    </button>
                  </div>
                </div>
              )}

              {/* 2. FORM NHẬP ĐỊA CHỈ */}
              {( !user || (user && (selectedAddressId === null || !addressData?.addresses || addressData.addresses.length === 0)) ) && (
                <ShippingForm 
                  form={form}
                  setForm={setForm}
                  provinces={provinces}
                  districts={districts}
                  wards={wards}
                  handleProvinceChange={handleProvinceChange}
                  handleDistrictChange={handleDistrictChange}
                  handleWardChange={handleWardChange}
                  isLoadingDistricts={isLoadingDistricts}
                  isLoadingWards={isLoadingWards}
                />
              )}

              {/* 3. PHƯƠNG THỨC VẬN CHUYỂN */}
              <div className="bg-white rounded-[16px] border border-brand-sand overflow-hidden shadow-sm">
                <div className="px-6 py-[18px] border-b border-brand-sand flex items-center justify-between bg-brand-ivory/30">
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[26px] h-[26px] rounded-full bg-primary flex items-center justify-center text-white text-[12px] font-bold">2</div>
                    <h2 className="text-[15px] font-bold text-primary uppercase tracking-tight">Phương thức vận chuyển</h2>
                  </div>
                </div>
                <div className="p-6">
                  <label className="border-[1.5px] border-primary bg-brand-ivory rounded-[12px] p-4 cursor-pointer flex items-center gap-[14px] transition-all ring-1 ring-primary/20 shadow-sm">
                    <input type="radio" checked readOnly className="accent-primary shrink-0" />
                    <span className="text-[22px]">🚀</span>
                    <div className="flex-1">
                      <div className="text-[13.5px] font-bold text-primary mb-[1px]">Giao hàng tiêu chuẩn</div>
                      <div className="text-[12px] text-brand-taupe">Dự kiến nhận hàng trong 2–4 ngày</div>
                    </div>
                    <span className={cn("text-[14px] font-bold", shippingFee === 0 ? "text-emerald-600" : "text-primary")}>
                      {isCalculatingFee ? <Spinner size="sm" /> : (shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee))}
                    </span>
                  </label>
                </div>
              </div>

              <PaymentMethods 
                paymentMethod={form.paymentMethod} 
                setPaymentMethod={(method) => setForm({ ...form, paymentMethod: method })} 
                stepNumber="3"
              />

              {/* 4. GHI CHÚ */}
              <div className="bg-white rounded-[16px] border border-brand-sand overflow-hidden shadow-sm">
                <div className="px-6 py-[18px] border-b border-brand-sand flex items-center justify-between bg-brand-ivory/30">
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[26px] h-[26px] rounded-full bg-primary flex items-center justify-center text-white text-[12px] font-bold">4</div>
                    <h2 className="text-[15px] font-bold text-primary uppercase tracking-tight">Ghi chú đơn hàng</h2>
                  </div>
                </div>
                <div className="p-6">
                  <textarea 
                    placeholder="Giao giờ hành chính, gọi trước khi đến..." 
                    value={form.orderNote}
                    onChange={(e) => setForm({ ...form, orderNote: e.target.value })}
                    rows={3}
                    className="w-full bg-brand-cream/30 border-[1.5px] border-brand-sand rounded-[12px] p-4 text-[13.5px] focus:outline-none focus:border-brand-bronze focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-6">
              <OrderSummary 
                items={displayItems} 
                subtotal={subtotal} 
                shippingFee={shippingFee} 
                isSubmitting={isSubmitting} 
                canSubmit={true} 
                isCalculatingFee={isCalculatingFee} 
                discountCode={discountCode} 
                setDiscountCode={setDiscountCode} 
                appliedDiscount={appliedDiscount} 
                discountAmount={discountAmount} 
                onApplyDiscount={handleApplyDiscount} 
                onRemoveDiscount={handleRemoveDiscount} 
                isApplyingDiscount={isApplyingDiscount} 
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
