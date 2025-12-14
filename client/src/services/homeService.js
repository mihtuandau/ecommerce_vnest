import apiService from './apiService';

const homeService = {
  
  getAllData: async () => {
    try {
      const [banners, categories, featuredProducts, bestSellers] = await Promise.all([
        apiService.get('/banners', { active: true })
          .catch(() => []),
        apiService.get('/categories')
          .catch(() => []),
        apiService.get('/products', { 
            minRating: 4,
            limit: 20
          })
          .then(res => res?.data || res || []).catch(() => []),
        apiService.get('/products', { 
            limit: 5,
            sortBy: 'sold'
          })
          .then(res => res?.data || res || []).catch(() => [])
      ]);

      return {
        banners,
        categories,
        featuredProducts,
        bestSellers
      };
    } catch (error) {return {
        banners: [],
        categories: [],
        featuredProducts: [],
        bestSellers: []
      };
    }
  },

  getNewArrivals: async (limit = 8) => {
    try {
      const response = await apiService.get('/products', {
          sortBy: 'newest',
          limit
        });
      return response?.data || response || [];
    } catch (error) {return [];
    }
  },

  getBestSellers: async (limit = 8) => {
    try {
      const response = await apiService.get('/products', {
          sortBy: 'newest',
          limit
        });
      return response?.data || response || [];
    } catch (error) {return [];
    }
  },

  getSaleProducts: async (limit = 8) => {
    try {
      const response = await apiService.get('/products', {
          sortBy: 'price-desc',
          limit
        });
      return response?.data || response || [];
    } catch (error) {return [];
    }
  }
};

export default homeService;
