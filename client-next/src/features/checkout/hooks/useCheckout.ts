"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ordersApi } from "@/features/orders/api/orders.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCart } from "@/features/cart/hooks";
import { useSystemSettings } from "@/features/settings/hooks";
import { useToast } from "@/hooks/useToast";
import { useCartStore } from "@/features/cart/store/cart.store";
import { CHECKOUT_CONSTANTS } from "@/features/checkout/constants";
import { validateCheckoutForm } from "@/features/checkout/utils/checkoutValidation";
import { useCheckoutForm } from "./useCheckoutForm";
import { useAddressManagement, AddressOption } from "./useAddressManagement";
import { useCheckoutDiscount } from "./useCheckoutDiscount";
import { useShippingFee } from "./useShippingFee";

export function useCheckout() {
  const { items, buyNowItem, clearBuyNowItem } = useCartStore();
  const { clearSelectedItems } = useCart();
  const { user } = useAuthStore();
  const { error } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: settings } = useSystemSettings();

  const [mounted, setMounted] = useState(false);
  const [hasAppliedDefault, setHasAppliedDefault] = useState(false);
  const [itemsChangedNotice, setItemsChangedNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastItemCount, setLastItemCount] = useState<number | null>(null);

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
    () =>
      displayItems.reduce(
        (sum, item) =>
          sum + (item.discountedPrice || item.price) * item.quantity,
        0
      ),
    [displayItems]
  );

  const {
    discountCode,
    setDiscountCode,
    appliedDiscount,
    discountAmount,
    isApplyingDiscount,
    handleApplyDiscount,
    handleRemoveDiscount,
  } = useCheckoutDiscount(subtotal);

  const { shippingFee, isCalculatingFee } = useShippingFee(
    form.districtId,
    form.wardCode,
    displayItems,
    subtotal
  );

  const paymentAvailability = useMemo(
    () => ({
      COD: settings?.codEnabled ?? true,
      VNPAY: settings?.vnpayEnabled ?? true,
    }),
    [settings?.codEnabled, settings?.vnpayEnabled]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const currentMethod = form.paymentMethod?.toUpperCase();

    if (currentMethod === "COD" && !paymentAvailability.COD) {
      setForm((prev) => ({
        ...prev,
        paymentMethod: paymentAvailability.VNPAY ? "VNPAY" : "",
      }));
    }

    if (currentMethod === "VNPAY" && !paymentAvailability.VNPAY) {
      setForm((prev) => ({
        ...prev,
        paymentMethod: paymentAvailability.COD ? "COD" : "",
      }));
    }
  }, [form.paymentMethod, paymentAvailability.COD, paymentAvailability.VNPAY, setForm]);

  useEffect(() => {
    if (mounted && lastItemCount !== null && displayItems.length < lastItemCount) {
      setItemsChangedNotice(true);
      setTimeout(
        () => setItemsChangedNotice(false),
        CHECKOUT_CONSTANTS.NOTIFICATION_TIMEOUT
      );
    }
    setLastItemCount(displayItems.length);
  }, [displayItems.length, mounted, lastItemCount]);

  const applySavedAddress = useCallback(
    async (addr: AddressOption) => {
      const result = await baseApplySavedAddress(addr);
      if (result && Object.keys(result).length > 0) {
        updateFormAddress(result);
      }
      return result;
    },
    [baseApplySavedAddress, updateFormAddress]
  );

  useEffect(() => {
    if (
      user &&
      addressData?.addresses &&
      addressData.addresses.length > 0 &&
      mounted &&
      !hasAppliedDefault
    ) {
      const defaultAddr =
        addressData.addresses.find((address: AddressOption) => address.isDefault) ||
        addressData.addresses[0];
      if (defaultAddr) {
        applySavedAddress(defaultAddr);
        setHasAppliedDefault(true);
      }
    }
  }, [addressData, mounted, hasAppliedDefault, user, applySavedAddress]);

  const handleProvinceChange = useCallback(
    async (id: string) => {
      const result = await baseHandleProvinceChange(id);
      updateFormAddress(result);
    },
    [baseHandleProvinceChange, updateFormAddress]
  );

  const handleDistrictChange = useCallback(
    async (id: string) => {
      const result = await baseHandleDistrictChange(id);
      updateFormAddress(result);
    },
    [baseHandleDistrictChange, updateFormAddress]
  );

  const handleWardChange = useCallback(
    (code: string) => {
      const result = baseHandleWardChange(code);
      updateFormAddress(result);
    },
    [baseHandleWardChange, updateFormAddress]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateCheckoutForm(form, !user);
    if (!validation.valid) {
      return error(validation.message || "Vui lòng kiểm tra lại thông tin");
    }

    if (!form.paymentMethod) {
      return error("Hiện chưa có phương thức thanh toán khả dụng.");
    }

    const method = form.paymentMethod.toUpperCase();
    if (method === "COD" && !paymentAvailability.COD) {
      return error("Thanh toán COD hiện đang tạm tắt.");
    }
    if (method === "VNPAY" && !paymentAvailability.VNPAY) {
      return error("Thanh toán VNPay hiện đang tạm tắt.");
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const isGuest = !user;
      const orderData = {
        items: displayItems.map((item) => ({
          variantId: Number(item.variantId),
          quantity: item.quantity,
        })),
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
        window.location.href = paymentLink;
        return;
      }

      if (isBuyNow) clearBuyNowItem();
      else clearSelectedItems();

      const successParams = new URLSearchParams();
      if (res.orderCode) successParams.set("orderCode", res.orderCode);
      if (res.id) successParams.set("orderId", String(res.id));
      successParams.set("contact", form.phone);
      router.push(`/checkout/success?${successParams.toString()}`);
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra khi đặt hàng";
      error(errMsg);
      setIsSubmitting(false);
    }
  };

  return {
    mounted,
    isSubmitting,
    isCalculatingFee,
    isApplyingDiscount,
    itemsChangedNotice,
    isBuyNow,
    paymentAvailability,
    displayItems,
    subtotal,
    shippingFee,
    form,
    setForm,
    updateFormField,
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
    discountCode,
    setDiscountCode,
    appliedDiscount,
    discountAmount,
    handleApplyDiscount,
    handleRemoveDiscount,
    handleSubmit,
    user,
  };
}
