import apiService from './apiService';
import { WISHLIST_ENDPOINTS } from '../config/apiConstants';

const wishlistService = {
  getWishlist: async () => {
    const response = await apiService.get(WISHLIST_ENDPOINTS.BASE);
    return response;
  },

  addToWishlist: async (variantId) => {
    const response = await apiService.post(WISHLIST_ENDPOINTS.BY_VARIANT(variantId));
    return response;
  },

  removeFromWishlist: async (variantId) => {
    const response = await apiService.delete(WISHLIST_ENDPOINTS.BY_VARIANT(variantId));
    return response;
  },

  checkWishlist: async (variantId) => {
    const response = await apiService.get(WISHLIST_ENDPOINTS.CHECK(variantId));
    return response;
  },

  clearWishlist: async () => {
    const response = await apiService.delete(WISHLIST_ENDPOINTS.BASE);
    return response;
  },
};

export default wishlistService;
