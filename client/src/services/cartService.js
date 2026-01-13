import apiService from './apiService';
import { CART_ENDPOINTS } from '../config/apiConstants';

const cartService = {
  getCart: async () => {
    return await apiService.get(CART_ENDPOINTS.BASE);
  },

  addItem: async (variantId, quantity = 1) => {
    return await apiService.post(CART_ENDPOINTS.ITEMS, {
      variantId,
      quantity,
    });
  },

  updateItem: async (variantId, quantity) => {
    return await apiService.put(CART_ENDPOINTS.ITEM_BY_VARIANT(variantId), {
      quantity,
    });
  },

  removeItem: async (variantId) => {
    return await apiService.delete(CART_ENDPOINTS.ITEM_BY_VARIANT(variantId));
  },

  clearCart: async () => {
    return await apiService.delete(CART_ENDPOINTS.BASE);
  },
};

export default cartService;
