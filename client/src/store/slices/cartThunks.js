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
  async ({ variantId, quantity, productData }, { rejectWithValue, dispatch }) => {
    try {
      await cartService.addItem(variantId, quantity);

      await dispatch(fetchCart());

      return { variantId, quantity, productData };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    }
  }
);

export const updateCartServer = createAsyncThunk(
  'cart/updateCartServer',
  async ({ variantId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      await cartService.updateItem(variantId, quantity);

      await dispatch(fetchCart());

      return { variantId, quantity };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật giỏ hàng');
    }
  }
);

export const removeFromCartServer = createAsyncThunk(
  'cart/removeFromCartServer',
  async (variantId, { rejectWithValue, dispatch }) => {
    try {
      await cartService.removeItem(variantId);

      await dispatch(fetchCart());

      return variantId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  }
);

export const clearCartServer = createAsyncThunk(
  'cart/clearCartServer',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await cartService.clearCart();

      await dispatch(fetchCart());

      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa giỏ hàng');
    }
  }
);
