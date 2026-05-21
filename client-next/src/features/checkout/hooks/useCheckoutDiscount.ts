"use client";

import { useState, useEffect, useCallback } from "react";
import { useCartStore } from "@/store/useCartStore";
import { discountsApi } from "@/features/discounts/api";
import { useToast } from "@/hooks/useToast";
import { CHECKOUT_MESSAGES } from "@/features/checkout/constants";
import {
  calculateDiscountAmount,
  formatCurrency,
} from "@/features/checkout/utils/checkoutValidation";
import type { DiscountValidationResponse } from "@/features/discounts/types";
import type { CheckoutDiscount } from "@/store/useCartStore";

export function useCheckoutDiscount(subtotal: number) {
  const { success, error, warning } = useToast();
  const { appliedDiscount: globalDiscount, setAppliedDiscount: setGlobalDiscount } =
    useCartStore();

  const [discountCode, setDiscountCode] = useState(globalDiscount?.code || "");
  const [appliedDiscount, setAppliedDiscount] =
    useState<CheckoutDiscount | null>(globalDiscount);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Sync discount amount when subtotal or applied discount changes
  useEffect(() => {
    setGlobalDiscount(appliedDiscount);

    if (!appliedDiscount) {
      setDiscountAmount(0);
      return;
    }

    // Check if discount still meets minimum order amount
    if (appliedDiscount.minOrderAmount && subtotal < appliedDiscount.minOrderAmount) {
      setAppliedDiscount(null);
      setDiscountAmount(0);
      setDiscountCode("");
      setGlobalDiscount(null);
      warning(
        `Đã gỡ mã vì giỏ hàng chưa đủ ${formatCurrency(appliedDiscount.minOrderAmount)}đ`
      );
      return;
    }

    const newAmount = calculateDiscountAmount(subtotal, appliedDiscount);
    setDiscountAmount(newAmount);
  }, [appliedDiscount, subtotal, setGlobalDiscount, warning]);

  const handleApplyDiscount = useCallback(
    async (codeFromModal?: string) => {
      const codeToValidate = (codeFromModal || discountCode).trim().toUpperCase();
      if (!codeToValidate) return;

      setIsApplyingDiscount(true);
      try {
        const res = (await discountsApi.validateDiscount(
          codeToValidate
        )) as DiscountValidationResponse;

        if (!res.isValid) {
          warning(res.message || CHECKOUT_MESSAGES.INVALID_DISCOUNT);
          return;
        }

        const discount = res.discount;
        if (!discount) return;

        if (discount.minOrderAmount && subtotal < discount.minOrderAmount) {
          warning(
            `Mã chỉ áp dụng cho đơn từ ${formatCurrency(discount.minOrderAmount)}đ`
          );
          return;
        }

        const voucherSaving = calculateDiscountAmount(subtotal, discount);

        setDiscountCode(codeToValidate);
        setAppliedDiscount({ ...discount, code: codeToValidate });
        setDiscountAmount(voucherSaving);
        success(
          `${CHECKOUT_MESSAGES.DISCOUNT_APPLIED}: -${formatCurrency(voucherSaving)}đ`
        );
      } catch (err: any) {
        error(err.response?.data?.message || CHECKOUT_MESSAGES.INVALID_DISCOUNT);
        setAppliedDiscount(null);
        setDiscountAmount(0);
      } finally {
        setIsApplyingDiscount(false);
      }
    },
    [discountCode, subtotal, error, success, warning]
  );

  const handleRemoveDiscount = useCallback(() => {
    setAppliedDiscount(null);
    setDiscountAmount(0);
    setDiscountCode("");
    setGlobalDiscount(null);
    success("Đã gỡ mã giảm giá");
  }, [success, setGlobalDiscount]);

  return {
    discountCode,
    setDiscountCode,
    appliedDiscount,
    discountAmount,
    isApplyingDiscount,
    handleApplyDiscount,
    handleRemoveDiscount,
  };
}
