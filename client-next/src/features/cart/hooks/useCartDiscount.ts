"use client";

import React from "react";
import { discountsApi } from "@/features/discounts/api";
import type { DiscountValidationResponse } from "@/features/discounts/types";
import {
  calculateCartDiscountAmount,
  isCartDiscountApplicable,
} from "@/features/cart/services";
import { useToast } from "@/hooks/useToast";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";

export function useCartDiscount(selectedTotalPrice: number) {
  const { success, error, warning } = useToast();
  const { appliedDiscount, setAppliedDiscount } = useCartStore();
  const [discountAmount, setDiscountAmount] = React.useState(0);
  const [isApplyingDiscount, setIsApplyingDiscount] = React.useState(false);

  const handleApplyDiscount = React.useCallback(
    async (code: string) => {
      if (!code) return;

      setIsApplyingDiscount(true);
      try {
        const res = (await discountsApi.validateDiscount(
          code
        )) as DiscountValidationResponse;

        if (!res.isValid) {
          warning(res.message || "Mã không hợp lệ");
          return;
        }

        const discount = res.discount;
        if (!discount) return;

        if (!isCartDiscountApplicable(discount, selectedTotalPrice)) {
          warning(
            `Mã chỉ áp dụng cho đơn từ ${formatCurrency(
              discount.minOrderAmount || 0
            )}`
          );
          return;
        }

        const saving = calculateCartDiscountAmount(discount, selectedTotalPrice);
        setAppliedDiscount({ ...discount, code });
        setDiscountAmount(saving);
        success(`Đã áp dụng mã: -${formatCurrency(saving)}`);
      } catch {
        error("Mã không hợp lệ");
      } finally {
        setIsApplyingDiscount(false);
      }
    },
    [error, selectedTotalPrice, setAppliedDiscount, success, warning]
  );

  const handleRemoveDiscount = React.useCallback(() => {
    setAppliedDiscount(null);
    setDiscountAmount(0);
    success("Đã gỡ mã giảm giá");
  }, [setAppliedDiscount, success]);

  React.useEffect(() => {
    if (!appliedDiscount) {
      setDiscountAmount(0);
      return;
    }

    if (!isCartDiscountApplicable(appliedDiscount, selectedTotalPrice)) {
      setAppliedDiscount(null);
      setDiscountAmount(0);
      warning(
        `Đã gỡ mã giảm giá vì đơn không đủ ${formatCurrency(
          appliedDiscount.minOrderAmount || 0
        )}`
      );
      return;
    }

    setDiscountAmount(calculateCartDiscountAmount(appliedDiscount, selectedTotalPrice));
  }, [appliedDiscount, selectedTotalPrice, setAppliedDiscount, warning]);

  return {
    appliedDiscount,
    discountAmount,
    isApplyingDiscount,
    handleApplyDiscount,
    handleRemoveDiscount,
  };
}
