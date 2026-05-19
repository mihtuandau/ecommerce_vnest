"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useCartStore } from "@/store/useCartStore";
import { ordersApi } from "@/features/orders/api";
import { useToast } from "@/hooks/useToast";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { CHECKOUT_CONSTANTS, CHECKOUT_MESSAGES } from "@/features/checkout/constants";
import { validateCheckoutForm } from "@/features/checkout/utils/checkoutValidation";
import { useCart } from "@/features/cart/hooks";

// Import extracted hooks
import { useCheckoutForm } from "./useCheckoutForm";
import { useAddressManagement, AddressOption } from "./useAddressManagement";
import { useCheckoutDiscount } from "./useCheckoutDiscount";
import { useShippingFee } from "./useShippingFee";

export function useCheckout() {
  const { 
    items, 
    buyNowItem, 
    clearBuyNowItem, 
  } = useCartStore();
  
  const { clearSelectedItems } = useCart();
  
  const { user } = useAuthStore();
  const { error } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [mounted, setMounted] = useState(false);
  const [hasAppliedDefault, setHasAppliedDefault] = useState(false);
  const [itemsChangedNotice, setItemsChangedNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastItemCount, setLastItemCount] = useState<number | null>(null);

  // Use extracted hooks
  const { form, setForm, updateFormField, updateFormAddress } = useCheckoutForm();
  const { 
    provinces, 
    districts, 
    wards, 
    isLoadingDistricts, 
    isLoadingWards,
    selectedAddressId,
    setSelectedAddressId,
    handleProvinceChange: baseHandleProvinceChange,
    handleDistrictChange: baseHandleDistrictChange,
    handleWardChange: baseHandleWardChange,
    applySavedAddress: baseApplySavedAddress,
    addressData,
  } = useAddressManagement();

  const isBuyNow = searchParams.get("buyNow") === "true";
  const displayItems = useMemo(
    () => (isBuyNow && buyNowItem ? [buyNowItem] : items.filter((i) => i.selected)),
    [isBuyNow, buyNowItem, items]
  );

  const subtotal = useMemo(
    () => displayItems.reduce((sum, i) => sum + (i.discountedPrice || i.price) * i.quantity, 0),
    [displayItems]
  );

  const { 
    discountCode, 
    setDiscountCode, 
    appliedDiscount, 
    discountAmount, 
    isApplyingDiscount, 
    handleApplyDiscount, 
    handleRemoveDiscount 
  } = useCheckoutDiscount(subtotal);

  const { shippingFee, isCalculatingFee } = useShippingFee(
    form.districtId,
    form.wardCode,
    displayItems,
    subtotal
  );

  // Mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Monitor items changes
  useEffect(() => {
    if (mounted && lastItemCount !== null && displayItems.length < lastItemCount) {
      setItemsChangedNotice(true);
      setTimeout(() => setItemsChangedNotice(false), CHECKOUT_CONSTANTS.NOTIFICATION_TIMEOUT);
    }
    setLastItemCount(displayItems.length);
  }, [displayItems.length, mounted]);

  // Wrapped address handlers
  const applySavedAddress = useCallback(async (addr: AddressOption) => {
    const result = await baseApplySavedAddress(addr);
    if (result && Object.keys(result).length > 0) {
      updateFormAddress(result);
    }
    return result;
  }, [baseApplySavedAddress, updateFormAddress]);

  // Load default address
  useEffect(() => {
    if (user && addressData?.addresses && addressData.addresses.length > 0 && mounted && !hasAppliedDefault) {
      const defaultAddr = addressData.addresses.find((a: AddressOption) => a.isDefault) || addressData.addresses[0];
      if (defaultAddr) {
        applySavedAddress(defaultAddr);
        setHasAppliedDefault(true);
      }
    }
  }, [addressData, mounted, hasAppliedDefault, user, applySavedAddress]);

  const handleProvinceChange = useCallback(async (id: string) => {
    const result = await baseHandleProvinceChange(id);
    updateFormAddress(result);
  }, [baseHandleProvinceChange, updateFormAddress]);

  const handleDistrictChange = useCallback(async (id: string) => {
    const result = await baseHandleDistrictChange(id);
    updateFormAddress(result);
  }, [baseHandleDistrictChange, updateFormAddress]);

  const handleWardChange = useCallback((code: string) => {
    const result = baseHandleWardChange(code);
    updateFormAddress(result);
  }, [baseHandleWardChange, updateFormAddress]);

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateCheckoutForm(form, !user);
    if (!validation.valid) {
      return error(validation.message || "Vui lòng kiểm tra lại thông tin");
    }

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
        // Don't clear items before payment redirect - user needs to see it in case they cancel
        window.location.href = paymentLink;
        return;
      }

      // Clear items after successful COD order (no payment needed)
      if (isBuyNow) clearBuyNowItem();
      else clearSelectedItems();

      const successParams = new URLSearchParams();
      if (res.orderCode) successParams.set("orderCode", res.orderCode);
      if (res.id) successParams.set("orderId", String(res.id));
      successParams.set("contact", form.phone);
      router.push(`/checkout/success?${successParams.toString()}`);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Có lỗi xảy ra khi đặt hàng";
      error(errMsg);
      setIsSubmitting(false); 
    }
  };

  return {
    // Status
    mounted,
    isSubmitting,
    isCalculatingFee,
    isApplyingDiscount,
    itemsChangedNotice,
    isBuyNow,

    // Cart & Items
    displayItems,
    subtotal,
    shippingFee,

    // Form
    form,
    setForm,
    updateFormField,

    // Address
    provinces,
    districts,
    wards,
    isLoadingDistricts,
    isLoadingWards,
    selectedAddressId,
    setSelectedAddressId,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    applySavedAddress,
    addressData,

    // Discount
    discountCode,
    setDiscountCode,
    appliedDiscount,
    discountAmount,
    handleApplyDiscount,
    handleRemoveDiscount,

    // Submit
    handleSubmit,
    user,
  };
}
