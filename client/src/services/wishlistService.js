import apiService from './apiService';

const wishlistService = {
  getWishlist: async () => {
    const response = await apiService.get('/wishlist');
    return response;
  },

  addToWishlist: async (variantId) => {
    const response = await apiService.post(`/wishlist/${variantId}`);
    return response;
  },

  removeFromWishlist: async (variantId) => {
    const response = await apiService.delete(`/wishlist/${variantId}`);
    return response;
  },

  checkWishlist: async (variantId) => {
    const response = await apiService.get(`/wishlist/check/${variantId}`);
    return response;
  },

  clearWishlist: async () => {
    const response = await apiService.delete('/wishlist');
    return response;
  },
};

export default wishlistService;
