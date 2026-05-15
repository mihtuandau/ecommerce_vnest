"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { shippingApi } from "@/features/shipping/api";
import { ordersApi } from "@/features/orders/api";
import { discountsApi } from "@/features/discounts/api";
import { useToast } from "@/hooks/useToast";
import { useRouter, useSearchParams } from "next/navigation";
import { Truck, ArrowLeft, CheckCircle2, ShoppingBag, ChevronDown } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useAuthStore } from "@/store/useAuthStore";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { useAddresses } from "@/features/users/hooks";
import { cn } from "@/utils/cn";

// Sub-components
import { ShippingForm } from "./ShippingForm";
import { PaymentMethods } from "./PaymentMethods";
import { OrderSummary } from "./OrderSummary";

type AddressOption = {
  id?: string | number;
  fullName?: string;
  phone?: string;
  email?: string;
  street?: string;
  province?: string;
  district?: string;
  city?: string;
  state?: string;
  ward?: string;
  provinceCode?: string | number | null;
  districtCode?: string | number | null;
  wardCode?: string | number | null;
  isDefault?: boolean;
};

type Province = {
  ProvinceID: number;
  ProvinceName: string;
};

type District = {
  DistrictID: number;
  DistrictName: string;
};

type Ward = {
  WardCode: string;
  WardName: string;
};

type CheckoutDiscount = {
  id?: number;
  code?: string;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
};

export function CheckoutContainer() {
  const { items, buyNowItem, clearBuyNowItem, appliedDiscount: globalDiscount, setAppliedDiscount: setGlobalDiscount } = useCartStore();
  const { user } = useAuthStore();
  const { success, error, warning } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [hasAppliedDefault, setHasAppliedDefault] = useState(false);

  const isBuyNow = searchParams.get("buyNow") === "true";
  const displayItems = React.useMemo(
    () => (isBuyNow && buyNowItem ? [buyNowItem] : items.filter((i) => i.selected)),
    [isBuyNow, buyNowItem, items]
  );

  const { data: addressData } = useAddresses();

  const subtotal = React.useMemo(
    () => displayItems.reduce((sum, i) => sum + (i.discountedPrice || i.price) * i.quantity, 0),
    [displayItems]
  );

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [discountCode, setDiscountCode] = useState(globalDiscount?.code || "");
  const [appliedDiscount, setAppliedDiscount] = useState<CheckoutDiscount | null>(globalDiscount);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    provinceId: "",
    districtId: "",
    wardCode: "",
    provinceName: "",
    districtName: "",
    wardName: "",
    street: "",
    paymentMethod: "COD",
    orderNote: "",
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | number | null>(null);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);

  useEffect(() => {
    setMounted(true);
    shippingApi.getProvinces().then((res) => setProvinces(res.data || []));

    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleProvinceChange = useCallback(async (id: string) => {
    const provinceName = provinces.find(p => String(p.ProvinceID) === String(id))?.ProvinceName || "";
    setForm((prev) => ({ ...prev, provinceId: id, provinceName, districtId: "", districtName: "", wardCode: "", wardName: "" }));
    setDistricts([]);
    setWards([]);
    if (!id) return;
    setIsLoadingDistricts(true);
    try {
      const res = await shippingApi.getDistricts(Number(id));
      setDistricts(res.data || []);
    } finally {
      setIsLoadingDistricts(false);
    }
  }, [provinces]);

  const handleDistrictChange = useCallback(async (id: string) => {
    const districtName = districts.find(d => String(d.DistrictID) === String(id))?.DistrictName || "";
    setForm((prev) => ({ ...prev, districtId: id, districtName, wardCode: "", wardName: "" }));
    setWards([]);
    if (!id) return;
    setIsLoadingWards(true);
    try {
      const res = await shippingApi.getWards(Number(id));
      setWards(res.data || []);
    } finally {
      setIsLoadingWards(false);
    }
  }, [districts]);

  const handleWardChange = useCallback((code: string) => {
    const wardName = wards.find(w => w.WardCode === code)?.WardName || "";
    setForm((prev) => ({ ...prev, wardCode: code, wardName }));
  }, [wards]);

  const applySavedAddress = useCallback(async (addr: AddressOption) => {
    try {
      const provinceId = addr.provinceCode ? String(addr.provinceCode) : "";
      const districtId = addr.districtCode ? String(addr.districtCode) : "";
      let wardCode = addr.wardCode ? String(addr.wardCode) : "";

      let provinceName = addr.province || addr.state || "";
      let districtName = addr.district || addr.city || "";
      let wardName = addr.ward || "";

      if (provinceId) {
        const distRes = await shippingApi.getDistricts(Number(provinceId));
        const dists = distRes.data || [];
        setDistricts(dists);
        
        if (!districtName && districtId) {
           districtName = dists.find((d: any) => String(d.DistrictID) === districtId)?.DistrictName || "";
        }

        if (districtId) {
          const wardRes = await shippingApi.getWards(Number(districtId));
          const wrds = wardRes.data || [];
          setWards(wrds);
          if (!wardCode && wrds.length > 0) wardCode = wrds[0].WardCode;
          
          if (!wardName && wardCode) {
            wardName = wrds.find((w: any) => w.WardCode === wardCode)?.WardName || "";
          }
        }
      }

      if (!provinceName && provinceId) {
        provinceName = provinces.find(p => String(p.ProvinceID) === provinceId)?.ProvinceName || "";
      }

      setForm((prev) => ({
        ...prev,
        fullName: addr.fullName || prev.fullName,
        phone: addr.phone || prev.phone,
        email: addr.email || prev.email || "",
        provinceId,
        provinceName,
        districtId,
        districtName,
        wardCode,
        wardName,
        street: addr.street || "",
      }));
      setSelectedAddressId(addr.id || null);

    } catch {
      error("Không thể áp dụng địa chỉ đã lưu");
    }
  }, [error, provinces]);

  useEffect(() => {
    if (user && addressData?.addresses && addressData.addresses.length > 0 && mounted && !hasAppliedDefault) {
      const defaultAddr = addressData?.addresses.find((a: AddressOption) => a.isDefault) || addressData?.addresses[0];
      if (defaultAddr) {
        applySavedAddress(defaultAddr);
        setHasAppliedDefault(true);
      }
    }
  }, [addressData, mounted, hasAppliedDefault, user, applySavedAddress]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (form.districtId) {
        setIsCalculatingFee(true);
        try {
          const totalWeight = displayItems.reduce((sum, i) => sum + 1000 * i.quantity, 0);
          const res = await shippingApi.calculateFee({
            to_district_id: Number(form.districtId),
            to_ward_code: form.wardCode || "",
            weight: totalWeight,
          });
          setShippingFee(res.data?.total || 0);
        } catch {
          setShippingFee(0);
        } finally {
          setIsCalculatingFee(false);
        }
      } else {
        setShippingFee(0);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.districtId, form.wardCode, displayItems]);

  const handleApplyDiscount = useCallback(async (codeFromModal?: string) => {
    const codeToValidate = (codeFromModal || discountCode).trim().toUpperCase();
    if (!codeToValidate) return;
    
    setIsApplyingDiscount(true);
    try {
      const res: any = await discountsApi.validateDiscount(codeToValidate);
      if (!res.isValid) {
        warning(res.message || "Mã giảm giá không hợp lệ");
        return;
      }

      const discount = res.discount;
      let voucherSaving = 0;
      const isPercentage = discount.discountType === "PERCENTAGE";
      const val = discount.discountValue || 0;

      if (isPercentage) {
        voucherSaving = Math.round((subtotal * val) / 100);
        if (discount.maxDiscountAmount && voucherSaving > discount.maxDiscountAmount) voucherSaving = discount.maxDiscountAmount;
      } else {
        voucherSaving = val;
      }
      voucherSaving = Math.min(voucherSaving, subtotal);

      if (discount.minOrderAmount && subtotal < discount.minOrderAmount) {
        warning(`Mã chỉ áp dụng cho đơn từ ${new Intl.NumberFormat('vi-VN').format(discount.minOrderAmount)}đ`);
        return;
      }

      setDiscountCode(codeToValidate);
      setAppliedDiscount({ ...discount, code: codeToValidate });
      setDiscountAmount(voucherSaving);
      success(`Đã áp dụng mã giảm giá: -${new Intl.NumberFormat('vi-VN').format(voucherSaving)}đ`);
    } catch (err: any) {
      error(err.response?.data?.message || "Mã giảm giá không hợp lệ");
      setAppliedDiscount(null);
      setDiscountAmount(0);
    } finally {
      setIsApplyingDiscount(false);
    }
  }, [discountCode, subtotal, error, success, warning]);

  const handleRemoveDiscount = useCallback(() => {
    setAppliedDiscount(null);
    setDiscountAmount(0);
    setDiscountCode("");
    setGlobalDiscount(null);
    success("Đã gỡ mã giảm giá");
  }, [success, setGlobalDiscount]);

  useEffect(() => {
    setGlobalDiscount(appliedDiscount);
    if (!appliedDiscount) {
      setDiscountAmount(0);
      return;
    }

    if (appliedDiscount.minOrderAmount && subtotal < appliedDiscount.minOrderAmount) {
      setAppliedDiscount(null);
      setDiscountAmount(0);
      setDiscountCode("");
      setGlobalDiscount(null);
      warning(`Đã gỡ mã vì giỏ hàng chưa đủ ${new Intl.NumberFormat('vi-VN').format(appliedDiscount.minOrderAmount)}đ`);
      return;
    }

    let voucherSaving = 0;
    const isPercentage = appliedDiscount.discountType === "PERCENTAGE";
    const val = appliedDiscount.discountValue || 0;

    if (isPercentage) {
      voucherSaving = Math.round((subtotal * val) / 100);
      if (appliedDiscount.maxDiscountAmount && voucherSaving > appliedDiscount.maxDiscountAmount) voucherSaving = appliedDiscount.maxDiscountAmount;
    } else {
      voucherSaving = val;
    }
    setDiscountAmount(Math.min(voucherSaving, subtotal));
  }, [appliedDiscount, subtotal, setGlobalDiscount, warning]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName) return error("Vui lòng nhập họ và tên người nhận");
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!form.phone) return error("Vui lòng nhập số điện thoại");
    if (!phoneRegex.test(form.phone.replace(/\s/g, ""))) return error("Số điện thoại không hợp lệ");
    if (!form.email) return error("Vui lòng nhập email");
    if (!form.provinceId || !form.districtId || !form.wardCode || !form.street) return error("Vui lòng nhập đầy đủ địa chỉ");

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const isGuest = !user;
      const orderData = {
        items: displayItems.map((i) => ({ variantId: Number(i.variantId), quantity: i.quantity })),
        shippingInfo: {
          fullName: form.fullName,
          phone: form.phone,
          province: form.provinceName,
          district: form.districtName,
          ward: form.wardName,
          street: form.street,
          districtCode: form.districtId,
          wardCode: form.wardCode,
          note: form.orderNote,
        },
        paymentMethod: form.paymentMethod,
        shippingFee: Math.round(shippingFee),
        discountCode: appliedDiscount?.code || undefined,
        guestEmail: form.email,
        guestPhone: form.phone,
      };

      const res = await ordersApi.createOrder(orderData, isGuest);
      const paymentLink = res.paymentLink || res.payment?.paymentLink;

      if (paymentLink) {
        if (isBuyNow) clearBuyNowItem();
        else displayItems.forEach((i) => useCartStore.getState().removeItem(i.variantId));
        window.location.href = paymentLink;
        return;
      }

      // success("Đặt hàng thành công!");
      const successParams = new URLSearchParams();
      if (res.orderCode) successParams.set("orderCode", res.orderCode);
      if (res.id) successParams.set("orderId", String(res.id));
      successParams.set("contact", form.phone);
      router.push(`/checkout/success?${successParams.toString()}`);
      
      setTimeout(() => {
        if (isBuyNow) clearBuyNowItem();
        else displayItems.forEach((i) => useCartStore.getState().removeItem(i.variantId));
      }, 100);

    } catch {
      error("Có lỗi xảy ra khi đặt hàng");
      setIsSubmitting(false); 
    }
  };

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
              <Skeleton className="h-64 w-full bg-white rounded-[16px] border border-brand-sand" />
              <Skeleton className="h-48 w-full bg-white rounded-[16px] border border-brand-sand" />
              <Skeleton className="h-32 w-full bg-white rounded-[16px] border border-brand-sand" />
            </div>
            <Skeleton className="h-[500px] w-full bg-white rounded-[16px] border border-brand-sand" />
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

  const showEmpty = !isBuyNow && items.filter(i => i.selected).length === 0;
  const showBuyNowEmpty = isBuyNow && !buyNowItem;

  return (
    <div className="bg-brand-cream min-h-screen pb-20 text-foreground font-sans-brand">
      {(showEmpty || showBuyNowEmpty) ? (
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

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 items-start">
            <div className="space-y-4">
              {/* 1. ĐỊA CHỈ GIAO HÀNG */}

              {/* 2. ĐỊA CHỈ GIAO HÀNG */}
              {user && addressData?.addresses && addressData.addresses.length > 0 ? (
                <div className="bg-white rounded-[16px] border border-brand-sand overflow-hidden">
                  <div className="px-6 py-[18px] border-b border-brand-sand flex items-center justify-between">
                    <div className="flex items-center gap-[10px]">
                      <div className="w-[26px] h-[26px] rounded-full bg-primary flex items-center justify-center text-white text-[12px] font-bold">1</div>
                      <h2 className="text-[15px] font-bold text-primary">Địa chỉ đã lưu</h2>
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="text-[12.5px] font-bold text-brand-bronze hover:underline p-0 h-auto" onClick={() => router.push("/account?tab=address")}>Quản lý</Button>
                  </div>
                  <div className="p-6 space-y-[10px]">
                    {addressData.addresses.map((addr: AddressOption) => (
                      <div 
                        key={addr.id} 
                        onClick={() => applySavedAddress(addr)}
                        className={cn("p-4 rounded-[12px] border transition-all cursor-pointer flex items-start gap-3", selectedAddressId === addr.id ? "border-primary bg-brand-ivory" : "border-brand-sand hover:border-brand-bronze/30 hover:bg-brand-ivory")}
                      >
                        <input type="radio" checked={selectedAddressId === addr.id} readOnly className="mt-1 accent-primary" />
                        <div className="addr-body">
                          <div className="text-[13.5px] font-medium text-primary mb-1 flex items-center">
                            {addr.fullName}
                            {addr.isDefault && <span className="ml-[6px] text-[10.5px] bg-brand-bronze/10 text-brand-bronze px-2 py-[2px] rounded-full font-medium">Mặc định</span>}
                          </div>
                          <p className="text-[12.5px] text-brand-taupe line-height-[1.5]">
                            {addr.street}, {addr.ward || wards.find(w => w.WardCode === addr.wardCode)?.WardName}, {addr.district || addr.city || districts.find(d => d.DistrictID === Number(addr.districtCode))?.DistrictName}, {addr.province || addr.state || provinces.find(p => p.ProvinceID === Number(addr.provinceCode))?.ProvinceName}
                          </p>
                          <p className="text-[12.5px] text-brand-taupe mt-1 font-bold">📞 {addr.phone}</p>
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => setSelectedAddressId(null)}
                      className={cn(
                        "flex items-center justify-center gap-2 text-[13px] border-[1.5px] border-dashed rounded-[10px] py-[11px] px-4 w-full transition-all font-medium mt-2",
                        selectedAddressId === null ? "border-primary bg-brand-ivory text-primary" : "border-brand-sand text-brand-bronze hover:bg-brand-ivory hover:border-brand-bronze"
                      )}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Dùng địa chỉ khác
                    </button>
                  </div>
                </div>
              ) : null}

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

              {/* PHƯƠNG THỨC VẬN CHUYỂN */}
              <div className="bg-white rounded-[16px] border border-brand-sand overflow-hidden">
                <div className="px-6 py-[18px] border-b border-brand-sand flex items-center justify-between">
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[26px] h-[26px] rounded-full bg-primary flex items-center justify-center text-white text-[12px] font-bold">
                      2
                    </div>
                    <h2 className="text-[15px] font-bold text-primary">Phương thức vận chuyển</h2>
                  </div>
                </div>
                <div className="p-6">
                  <label className="border-[1.5px] border-primary bg-brand-ivory rounded-[12px] p-4 cursor-pointer flex items-center gap-[14px] transition-all">
                    <input type="radio" checked readOnly className="accent-primary shrink-0" />
                    <span className="text-[22px]">🚀</span>
                    <div className="flex-1">
                      <div className="text-[13.5px] font-medium text-primary mb-[2px]">Giao hàng nhanh</div>
                      <div className="text-[12px] text-brand-taupe">Giao trong 2–3 ngày làm việc</div>
                      <div className="text-[12px] text-emerald-600 font-medium">Dự kiến: 16/05 – 17/05</div>
                    </div>
                    <span className={cn("text-[14px] font-bold whitespace-nowrap", shippingFee === 0 ? "text-emerald-600" : "text-primary")}>
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

              {/* GHI CHÚ ĐƠN HÀNG */}
              <div className="bg-white rounded-[16px] border border-brand-sand overflow-hidden">
                <div className="px-6 py-[18px] border-b border-brand-sand flex items-center justify-between bg-white">
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[26px] h-[26px] rounded-full bg-primary flex items-center justify-center text-white text-[12px] font-bold">
                      4
                    </div>
                    <h2 className="text-[15px] font-bold text-primary">Ghi chú đơn hàng</h2>
                  </div>
                  <span className="text-[12px] text-brand-taupe">Không bắt buộc</span>
                </div>
                <div className="p-6 space-y-4">
                  <textarea 
                    placeholder="Giao giờ hành chính · Gọi trước khi giao · Để ở bảo vệ..." 
                    value={form.orderNote}
                    onChange={(e) => setForm({ ...form, orderNote: e.target.value })}
                    rows={4}
                    className="w-full bg-white border-[1.5px] border-brand-sand rounded-[10px] p-[11px] text-[13px] text-foreground placeholder:text-brand-taupe focus:outline-none focus:border-brand-bronze transition-all resize-none font-sans leading-relaxed"
                  />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="gift-wrap" className="h-4 w-4 rounded border-brand-sand text-primary accent-primary" />
                    <label htmlFor="gift-wrap" className="text-[13px] text-foreground cursor-pointer">
                      🎁 Gói quà miễn phí (đơn trên 500k)
                    </label>
                  </div>
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
