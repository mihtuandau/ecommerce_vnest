import { CHECKOUT_MESSAGES, CHECKOUT_VALIDATION } from "@/features/checkout/constants";
import type { CheckoutDiscount } from "@/features/cart/store/cart.store";

export type CheckoutFormData = {
  fullName: string;
  phone: string;
  email: string;
  provinceId: string;
  districtId: string;
  wardCode: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  street: string;
  paymentMethod: string;
  orderNote: string;
};

export const validateCheckoutForm = (
  form: CheckoutFormData,
  isGuest?: boolean
): { valid: boolean; message?: string } => {
  if (!form.fullName?.trim()) {
    return { valid: false, message: CHECKOUT_MESSAGES.FULL_NAME };
  }

  if (!form.phone?.trim()) {
    return { valid: false, message: CHECKOUT_MESSAGES.PHONE };
  }

  const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
  if (!phoneRegex.test(form.phone.replace(/\s/g, ""))) {
    return { valid: false, message: CHECKOUT_MESSAGES.INVALID_PHONE };
  }

  if (isGuest && !form.email?.trim()) {
    return { valid: false, message: CHECKOUT_MESSAGES.EMAIL };
  }

  if (!form.provinceId || !form.districtId || !form.wardCode || !form.street?.trim()) {
    return { valid: false, message: CHECKOUT_MESSAGES.INVALID_ADDRESS };
  }

  return { valid: true };
};

export const calculateDiscountAmount = (
  subtotal: number,
  discount: CheckoutDiscount | null
): number => {
  if (!discount) return 0;

  let voucherSaving = 0;
  const isPercentage = discount.discountType === "PERCENTAGE";
  const val = discount.discountValue || 0;

  if (isPercentage) {
    voucherSaving = Math.round((subtotal * val) / 100);
    if (discount.maxDiscountAmount && voucherSaving > discount.maxDiscountAmount) {
      voucherSaving = discount.maxDiscountAmount;
    }
  } else {
    voucherSaving = val;
  }

  return Math.min(voucherSaving, subtotal);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN").format(amount);
};
