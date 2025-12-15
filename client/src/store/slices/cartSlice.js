import { createSlice, current } from '@reduxjs/toolkit';
import { notify } from '../../utils/notification';
import { loadCartFromStorage, saveCartToStorage, clearCartStorage } from './cartHelpers';
import {
  fetchCart,
  addToCartServer,
  updateCartServer,
  removeFromCartServer,
  clearCartServer,
} from './cartThunks';

const initialState = {
  items: loadCartFromStorage(),
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartGuest: (state, action) => {
      const { variantId, quantity, productData } = action.payload;
      const existingItem = state.items.find(item => item.variantId === variantId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          variantId,
          quantity,
          product: productData,
          addedAt: new Date().toISOString()
        });
      }

      saveCartToStorage(current(state.items));
    },

    updateCartItemGuest: (state, action) => {
      const { variantId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.variantId === variantId);

      if (itemIndex !== -1) {
        if (quantity < 1) {
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].quantity = quantity;
        }
        saveCartToStorage(current(state.items));
      }
    },

    removeFromCartGuest: (state, action) => {
      const variantId = action.payload;
      state.items = state.items.filter(item => item.variantId !== variantId);
      saveCartToStorage([...state.items]);
      notify.success('Đã xóa khỏi giỏ hàng', 2000);
    },

    clearCartGuest: (state) => {
      state.items = [];
      clearCartStorage();
    },

    syncGuestCartToServer: (state) => {
      saveCartToStorage(current(state.items));
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      if (action.payload) {
        notify.error(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        console.log('🎯 fetchCart.fulfilled - payload:', action.payload);
        // Deduplicate items by variantId
        const items = action.payload;
        const deduped = items.reduce((acc, item) => {
          const existing = acc.find(i => i.variantId === item.variantId);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            acc.push(item);
          }
          return acc;
        }, []);
        console.log('📝 Setting state.items to:', deduped);
        state.items = deduped;
        // Don't save to localStorage when fetching from server - data is in DB
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCartServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartServer.fulfilled, (state, action) => {
        state.loading = false;
        // Don't update local state since fetchCart() already synced from server
        // This avoids duplicate items that cause wrong cart count
        notify.success('Đã lưu vào giỏ hàng!', 2000);
      })
      .addCase(addToCartServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        notify.error(action.payload);
      })
      // Update Cart Server
      .addCase(updateCartServer.fulfilled, (state, action) => {
        // Don't update local state since fetchCart() already synced from server
      })
      .addCase(updateCartServer.rejected, (state, action) => {
        state.error = action.payload;
        notify.error(action.payload);
      })
      // Remove from Cart Server
      .addCase(removeFromCartServer.fulfilled, (state, action) => {
        // Don't update local state since fetchCart() already synced from server
        notify.success('Đã xóa khỏi giỏ hàng!');
      })
      .addCase(removeFromCartServer.rejected, (state, action) => {
        state.error = action.payload;
        notify.error(action.payload);
      })
      // Clear Cart Server
      .addCase(clearCartServer.fulfilled, (state) => {
        // Don't update local state since fetchCart() already synced from server
        notify.success('Đã xóa giỏ hàng', 2000);
      })
      .addCase(clearCartServer.rejected, (state, action) => {
        state.error = action.payload;
        notify.error(action.payload);
      });
  },
});

// Export actions
export const {
  addToCartGuest,
  updateCartItemGuest,
  removeFromCartGuest,
  clearCartGuest,
  syncGuestCartToServer,
  setLoading,
  setError,
} = cartSlice.actions;

// Re-export selectors and thunks for convenience
export {
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectCartCount,
  selectCartTotal,
  selectCartItemsCount,
  selectIsInCart,
  selectItemQuantity,
  selectItemByVariantId,
} from './cartSelectors';

export {
  fetchCart,
  addToCartServer,
  updateCartServer,
  removeFromCartServer,
  clearCartServer,
} from './cartThunks';

export default cartSlice.reducer;
