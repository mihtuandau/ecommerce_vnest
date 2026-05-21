"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Truck, ShoppingBag, ChevronLeft } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

// Custom Hook
import { useCheckout } from "../hooks/useCheckout";

// Sub-components
import { ShippingForm } from "../components/ShippingForm";
import { PaymentMethods } from "../components/PaymentMethods";
import { OrderSummary } from "../components/OrderSummary";
import { CheckoutSteps } from "../components/CheckoutSteps";
import { CheckoutCard } from "../components/CheckoutCard";
import { SavedAddresses } from "../components/SavedAddresses";
import { ShippingMethod } from "../components/ShippingMethod";

export function CheckoutView() {
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
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Chưa có sản phẩm nào
          </h1>
          <Button
            onClick={() => router.push("/shop")}
            className="rounded-xl px-10 h-12 font-bold"
          >
            Quay lại cửa hàng
          </Button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-9">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1 text-[13px] text-brand-taupe hover:text-brand-espresso transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Quay lại</span>
          </button>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-[32px] font-bold text-primary tracking-tight font-serif">
              Thanh toán
            </h1>
            <div className="flex items-center gap-1.5 text-[12.5px] text-brand-taupe">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-emerald-600"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Thanh toán bảo mật SSL
            </div>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <CheckoutSteps currentStep={2} />
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

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 items-start"
          >
            <div className="space-y-4">
              {/* Step 1: Saved Addresses or Shipping Form */}
              {user && addressData?.addresses && addressData.addresses.length > 0 && (
                <SavedAddresses
                  addresses={addressData.addresses}
                  selectedAddressId={selectedAddressId}
                  setSelectedAddressId={setSelectedAddressId}
                  applySavedAddress={applySavedAddress}
                  onManageClick={() => router.push("/account?tab=address")}
                />
              )}

              {(!user ||
                (user &&
                  (!addressData?.addresses ||
                    addressData.addresses.length === 0))) && (
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

              {/* Step 2: Shipping Method */}
              <ShippingMethod
                shippingFee={shippingFee}
                isCalculatingFee={isCalculatingFee}
              />

              {/* Step 3: Payment Methods */}
              <PaymentMethods
                paymentMethod={form.paymentMethod}
                setPaymentMethod={(method) =>
                  setForm((prev: any) => ({ ...prev, paymentMethod: method }))
                }
                stepNumber="3"
              />

              {/* Step 4: Notes */}
              <CheckoutCard step="4" title="Ghi chú đơn hàng">
                <Textarea
                  placeholder="Giao giờ hành chính, gọi trước khi đến..."
                  value={form.orderNote}
                  onChange={(e) =>
                    setForm((prev: any) => ({ ...prev, orderNote: e.target.value }))
                  }
                  rows={3}
                  className="w-full bg-brand-cream/30 border-[1.5px] border-brand-sand rounded-[12px] p-4 text-[13.5px] focus:outline-none focus:border-brand-bronze focus:bg-white transition-all resize-none"
                />
              </CheckoutCard>
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
