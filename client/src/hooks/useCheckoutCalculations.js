import { useMemo } from 'react';

export const useCheckoutCalculations = (cartItems, appliedDiscount) => {
  return useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.product?.variant?.price || item.variant?.price || item.price || 0;
      return sum + (Number(price) * item.quantity);
    }, 0);
    
    const shipping = subtotal >= 500000 ? 0 : 30000;

    let discount = 0;
    if (appliedDiscount) {
      if (appliedDiscount.discountType === 'PERCENTAGE') {

        discount = Math.round((subtotal * appliedDiscount.discountValue) / 100);
        if (appliedDiscount.maxDiscountAmount || appliedDiscount.maxDiscount) {
          const max = appliedDiscount.maxDiscountAmount || appliedDiscount.maxDiscount;
          discount = Math.min(discount, max);
        }
      } else if (appliedDiscount.discountType === 'FIXED') {
        discount = appliedDiscount.discountValue;
      }
    }

    discount = Math.min(discount, subtotal);
    
    const total = subtotal + shipping - discount;
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    return { subtotal, shipping, discount, total, itemCount };
  }, [cartItems, appliedDiscount]);
};





