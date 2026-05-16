"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useCartStore } from "@/store/useCartStore";
import { shippingApi } from "@/features/shipping/api";
import { ordersApi } from "@/features/orders/api";
import { discountsApi } from "@/features/discounts/api";
import { useToast } from "@/hooks/useToast";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAddresses } from "@/features/users/hooks";

export type AddressOption = {
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

export function useCheckout() {
  const { 
    items, 
    buyNowItem, 
    clearBuyNowItem, 
    appliedDiscount: globalDiscount, 
    setAppliedDiscount: setGlobalDiscount 
  } = useCartStore();
  
  const { user } = useAuthStore();
  const { success, error, warning } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [hasAppliedDefault, setHasAppliedDefault] = useState(false);
  const [itemsChangedNotice, setItemsChangedNotice] = useState(false);

  const isBuyNow = searchParams.get("buyNow") === "true";
  const displayItems = useMemo(
    () => (isBuyNow && buyNowItem ? [buyNowItem] : items.filter((i) => i.selected)),
    [isBuyNow, buyNowItem, items]
  );

  // Monitor changes to displayItems to notify user if items are removed externally
  const [lastItemCount, setLastItemCount] = useState<number | null>(null);

  useEffect(() => {
    if (mounted && lastItemCount !== null && displayItems.length < lastItemCount) {
      setItemsChangedNotice(true);
      setTimeout(() => setItemsChangedNotice(false), 8000); // Hide after 8s
    }
    setLastItemCount(displayItems.length);
  }, [displayItems.length, mounted]);

  const { data: addressData } = useAddresses();

  const subtotal = useMemo(
    () => displayItems.reduce((sum, i) => sum + (i.discountedPrice || i.price) * i.quantity, 0),
    [displayItems]
  );

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [discountCode, setDiscountCode] = useState(globalDiscount?.code || "");
  const [appliedDiscount, setAppliedDiscount] = useState<any | null>(globalDiscount);
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

      const provinceName = addr.province || addr.state || "";
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
  }, [error]);

  useEffect(() => {
    if (user && addressData?.addresses && addressData.addresses.length > 0 && mounted && !hasAppliedDefault) {
      const defaultAddr = addressData.addresses.find((a: AddressOption) => a.isDefault) || addressData.addresses[0];
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

  return {
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
  };
}
