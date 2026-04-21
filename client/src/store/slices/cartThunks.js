import { createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';

const getImageUrl = (images, variantId) => {
  const variantImage = images.find(img => img.variantId === variantId);
  return variantImage?.url || images[0]?.url || images[0]?.imageUrl;
};

const transformCartItem = (item) => ({
  variantId: item.variantId,
  quantity: item.quantity,
  product: {
    id: item.variant?.product?.id,
    name: item.variant?.product?.name,
    image: getImageUrl(item.variant?.product?.images || [], item.variantId),
    variant: {
      id: item.variant?.id,
      price: item.variant?.price,
      size: item.variant?.size,
      color: item.variant?.color,
      stock: item.variant?.stock,
    }
  },
  addedAt: item.createdAt || new Date().toISOString()
});

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await cartService.getCart();
      const cartItems = data.cartItems || [];
      const transformedItems = cartItems.map(transformCartItem);
      return transformedItems;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải giỏ hàng');
    }
  }
);

export const addToCartServer = createAsyncThunk(
  'cart/addToCartServer',
  async ({ variantId, quantity, productData }, { rejectWithValue }) => {
    try {
      // Incremental update instead of full fetch to prevent race condition
      const result = await cartService.addItem(variantId, quantity);
      return transformCartItem(result);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    }
  }
);

export const updateCartServer = createAsyncThunk(
  'cart/updateCartServer',
  async ({ variantId, quantity }, { rejectWithValue }) => {
    try {
      // Incremental update instead of full fetch to prevent race condition
      const result = await cartService.updateItem(variantId, quantity);
      return transformCartItem(result);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật giỏ hàng');
    }
  }
);

export const removeFromCartServer = createAsyncThunk(
  'cart/removeFromCartServer',
  async (variantId, { rejectWithValue }) => {
    try {
      // Remove item without full fetch to prevent race condition
      await cartService.removeItem(variantId);
      return variantId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  }
);

export const clearCartServer = createAsyncThunk(
  'cart/clearCartServer',
  async (_, { rejectWithValue }) => {
    try {
      // Clear cart without full fetch to prevent race condition
      await cartService.clearCart();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa giỏ hàng');
    }
  }
);






