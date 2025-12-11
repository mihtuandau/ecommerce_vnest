import axiosInstance from '../config/api.config';

const homeService = {
  
  getAllData: async () => {
    try {
      const [banners, categories, featuredProducts] = await Promise.all([
        axiosInstance.get('/banners', { 
          params: { active: true } 
        }).then(res => res.data).catch(() => []),
        axiosInstance.get('/categories')
          .then(res => res.data).catch(() => []),
        axiosInstance.get('/products', {
          params: { 
            limit: 8,
            sortBy: 'sold'
          }
        }).then(res => res.data?.data || res.data || []).catch(() => [])
      ]);

      return {
        banners,
        categories,
        featuredProducts
      };
    } catch (error) {return {
        banners: [],
        categories: [],
        featuredProducts: []
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
