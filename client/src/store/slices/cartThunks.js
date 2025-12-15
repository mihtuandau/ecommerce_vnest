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
      const response = await cartService.getCart();
      const cartItems = response.data.cartItems || [];
      return cartItems.map(transformCartItem);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải giỏ hàng');
    }
  }
);

/**
 * Add item to cart on server
 */
export const addToCartServer = createAsyncThunk(
  'cart/addToCartServer',
  async ({ variantId, quantity, productData }, { rejectWithValue }) => {
    try {
      console.log('➕ Adding to cart (server):', { variantId, quantity });
      await cartService.addItem(variantId, quantity);
      console.log('✅ Added to cart (server) successfully');
      return { variantId, quantity, productData };
    } catch (error) {
      console.error('❌ addToCartServer error:', error);
      return rejectWithValue(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    }
  }
);

/**
 * Update cart item quantity on server
 */
export const updateCartServer = createAsyncThunk(
  'cart/updateCartServer',
  async ({ variantId, quantity }, { rejectWithValue }) => {
    try {
      console.log('🔄 Updating cart item (server):', { variantId, quantity });
      await cartService.updateItem(variantId, quantity);
      console.log('✅ Updated cart item (server) successfully');
      return { variantId, quantity };
    } catch (error) {
      console.error('❌ updateCartServer error:', error);
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật giỏ hàng');
    }
  }
);

/**
 * Remove item from cart on server
 */
export const removeFromCartServer = createAsyncThunk(
  'cart/removeFromCartServer',
  async (variantId, { rejectWithValue }) => {
    try {
      console.log('🗑️ Removing from cart (server):', { variantId });
      await cartService.removeItem(variantId);
      console.log('✅ Removed from cart (server) successfully');
      return variantId;
    } catch (error) {
      console.error('❌ removeFromCartServer error:', error);
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  }
);

export const clearCartServer = createAsyncThunk(
  'cart/clearCartServer',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🧹 Clearing cart (server)...');
      await cartService.clearCart();
      console.log('✅ Cleared cart (server) successfully');
      return true;
    } catch (error) {
      console.error('❌ clearCartServer error:', error);
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa giỏ hàng');
    }
  }
);
