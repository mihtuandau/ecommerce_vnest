"use client";

import { useState, useEffect } from "react";
import { shippingApi } from "@/features/shipping/api";
import { useSystemSettings } from "@/features/settings/hooks";
import { CHECKOUT_CONSTANTS } from "@/features/checkout/constants";

interface CartItem {
  quantity: number;
  [key: string]: any;
}

export function useShippingFee(
  districtId: string,
  wardCode: string,
  displayItems: CartItem[],
  subtotal: number,
) {
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);
  const { data: settings } = useSystemSettings();

  useEffect(() => {
    // If order qualifies for free shipping, set fee to 0 immediately
    const threshold = settings?.freeShippingThreshold ?? CHECKOUT_CONSTANTS.FREE_SHIPPING_THRESHOLD;
    if (settings && subtotal >= threshold) {
      setShippingFee(0);
      return;
    }

    // Debounce shipping calculation
    const timer = setTimeout(async () => {
      if (!districtId) {
        setShippingFee(0);
        return;
      }

      setIsCalculatingFee(true);
      try {
        const totalWeight = displayItems.reduce(
          (sum, i) => sum + CHECKOUT_CONSTANTS.WEIGHT_MULTIPLIER * i.quantity,
          0
        );

        const res = await shippingApi.calculateFee({
          to_district_id: Number(districtId),
          to_ward_code: wardCode || "",
          weight: totalWeight,
        });

        setShippingFee(
          res.data?.total || settings?.shippingFee || CHECKOUT_CONSTANTS.DEFAULT_SHIPPING_FEE
        );
      } catch {
        // Fallback to settings if GHN API fails
        setShippingFee(settings?.shippingFee || CHECKOUT_CONSTANTS.DEFAULT_SHIPPING_FEE);
      } finally {
        setIsCalculatingFee(false);
      }
    }, CHECKOUT_CONSTANTS.SHIPPING_CALCULATION_DELAY);

    return () => clearTimeout(timer);
  }, [districtId, wardCode, displayItems, subtotal, settings]);

  return { shippingFee, isCalculatingFee };
}
