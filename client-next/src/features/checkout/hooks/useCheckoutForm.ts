"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { CheckoutFormData } from "@/features/checkout/utils/checkoutValidation";

const initialFormState: CheckoutFormData = {
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
};

export function useCheckoutForm() {
  const { user } = useAuthStore();
  const [form, setForm] = useState<CheckoutFormData>(initialFormState);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const updateFormField = useCallback(
    <TField extends keyof CheckoutFormData>(
      field: TField,
      value: CheckoutFormData[TField]
    ) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateFormAddress = useCallback((address: Partial<CheckoutFormData>) => {
    setForm((prev) => ({ ...prev, ...address }));
  }, []);

  const resetForm = useCallback(() => {
    const resetState = {
      ...initialFormState,
      fullName: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
    };
    setForm(resetState);
  }, [user]);

  return {
    form,
    setForm,
    updateFormField,
    updateFormAddress,
    resetForm,
  };
}
