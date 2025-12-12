import axiosInstance from '../config/api.config';

const homeService = {
  
  getAllData: async () => {
    try {
      const [banners, categories, featuredProducts, bestSellers] = await Promise.all([
        axiosInstance.get('/banners', { 
          params: { active: true } 
        }).then(res => res.data).catch(() => []),
        axiosInstance.get('/categories')
          .then(res => res.data).catch(() => []),
        axiosInstance.get('/products', {
          params: { 
            minRating: 4,
            limit: 20
          }
        }).then(res => res.data?.data || res.data || []).catch(() => []),
        axiosInstance.get('/products', {
          params: { 
            limit: 5,
            sortBy: 'sold'
          }
        }).then(res => res.data?.data || res.data || []).catch(() => [])
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
      const response = await axiosInstance.get('/products', {
        params: {
          sortBy: 'newest',
          limit
        }
      });
      return response.data?.data || response.data || [];
    } catch (error) {return [];
    }
  },

  getBestSellers: async (limit = 8) => {
    try {
      const response = await axiosInstance.get('/products', {
        params: {
          sortBy: 'newest',
          limit
        }
      });
      return response.data?.data || response.data || [];
    } catch (error) {return [];
    }
  },

  getSaleProducts: async (limit = 8) => {
    try {
      const response = await axiosInstance.get('/products', {
        params: {
          sortBy: 'price-desc',
          limit
        }
      });
      return response.data?.data || response.data || [];
    } catch (error) {return [];
    }
  }
};

export default homeService;
