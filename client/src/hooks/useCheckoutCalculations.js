import { useMemo } from 'react';

export const useCheckoutCalculations = (cartItems, appliedDiscount) => {
  return useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.product?.variant?.price || item.variant?.price || item.price || 0;
      return sum + (Number(price) * item.quantity);
    }, 0);
    
    const shipping = subtotal > 500000 ? 0 : 30000;
    const totalBeforeDiscount = subtotal + shipping;

    let discount = 0;
    if (appliedDiscount) {
      if (appliedDiscount.discountType === 'PERCENTAGE') {
        discount = (totalBeforeDiscount * appliedDiscount.discountValue) / 100;
        if (appliedDiscount.maxDiscount) {
          discount = Math.min(discount, appliedDiscount.maxDiscount);
        }
      } else if (appliedDiscount.discountType === 'FIXED') {
        discount = appliedDiscount.discountValue;
      }
    }
    
    const total = totalBeforeDiscount - discount;
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, shipping, discount, total, itemCount };
  }, [cartItems, appliedDiscount]);
};