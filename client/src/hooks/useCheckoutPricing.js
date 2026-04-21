import { useMemo } from 'react';
import { computeDiscountFromMap } from '../utils/formatters';
import { useCheckoutCalculations } from './useCheckoutCalculations';

export const useCheckoutPricing = (cartItems, discountMap, appliedDiscount, providedShipping) => {
  const adjustedCartItems = useMemo(() => {
    if (!discountMap || Object.keys(discountMap).length === 0) return cartItems;
    return cartItems.map((item) => {
      const productId = item.product?.id || item.productId;
      const originalPrice = item.product?.variant?.price || item.price || 0;
      const flashPrice = computeDiscountFromMap(productId, originalPrice, discountMap);

      if (flashPrice === originalPrice) return item;
      return {
        ...item,
        product: {
          ...item.product,
          variant: {
            ...(item.product?.variant || {}),
            price: flashPrice,
            originalPrice,
          },
        },
      };
    });
  }, [cartItems, discountMap]);

  const flashSaleDiscount = useMemo(() => {
    if (!discountMap || Object.keys(discountMap).length === 0) return 0;
    return cartItems.reduce((sum, item) => {
      const productId = item.product?.id || item.productId;
      const originalPrice = item.product?.variant?.price || item.price || 0;
      const flashPrice = computeDiscountFromMap(productId, originalPrice, discountMap);
      return sum + (originalPrice - flashPrice) * item.quantity;
    }, 0);
  }, [cartItems, discountMap]);

  const originalSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.product?.variant?.price || item.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const manualCodeSaving = useMemo(() => {
    if (!appliedDiscount) return 0;
    let saving = 0;
    if (appliedDiscount.discountType === "PERCENTAGE") {
      saving = Math.round((originalSubtotal * appliedDiscount.discountValue) / 100);
      if (appliedDiscount.maxDiscountAmount) saving = Math.min(saving, appliedDiscount.maxDiscountAmount);
    } else if (appliedDiscount.discountType === "FIXED") {
      saving = appliedDiscount.discountValue;
    }
    return Math.min(saving, originalSubtotal);
  }, [appliedDiscount, originalSubtotal]);

  const autoApplyWins = flashSaleDiscount >= manualCodeSaving;
  const effectiveCartItems = autoApplyWins ? adjustedCartItems : cartItems;
  const effectiveDiscount = autoApplyWins ? null : appliedDiscount;

  const result = useCheckoutCalculations(effectiveCartItems, effectiveDiscount, providedShipping);

  return {
    ...result,
    effectiveCartItems,
    effectiveDiscount,
    autoApplyWins,
    flashSaleDiscount
  };
};
