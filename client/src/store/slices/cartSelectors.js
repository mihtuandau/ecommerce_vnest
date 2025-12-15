import { createSelector } from '@reduxjs/toolkit';

// Base Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

// Memoized Selectors
export const selectCartCount = createSelector(
  [selectCartItems],
  (items) => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    console.log('🔢 Cart count calculation:', { items, count });
    return count;
  }
);

export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => {
    const price = item.product?.variant?.price || 0;
    return sum + price * item.quantity;
  }, 0)
);

export const selectCartItemsCount = createSelector(
  [selectCartItems],
  (items) => items.length
);

// Parameterized Selectors
export const selectIsInCart = (variantId) => 
  createSelector(
    [selectCartItems],
    (items) => items.some(item => item.variantId === variantId)
  );

export const selectItemQuantity = (variantId) =>
  createSelector(
    [selectCartItems],
    (items) => {
      const item = items.find(item => item.variantId === variantId);
      return item?.quantity || 0;
    }
  );

export const selectItemByVariantId = (variantId) =>
  createSelector(
    [selectCartItems],
    (items) => items.find(item => item.variantId === variantId)
  );
