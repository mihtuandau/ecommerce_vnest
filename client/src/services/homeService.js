import axiosInstance from '../config/api.config';

/**
 * Homepage Service - Tối ưu API calls cho trang chủ
 */
const homeService = {
  /**
   * Lấy tất cả dữ liệu cho homepage trong 1 lần gọi
   * Sử dụng Promise.all để gọi song song, tối ưu performance
   */
  getAllData: async () => {
    try {
      const [banners, categories, featuredProducts] = await Promise.all([
        // Get active banners
        axiosInstance.get('/banners', { 
          params: { active: true } 
        }).then(res => res.data).catch(() => []),
        
        // Get all categories
        axiosInstance.get('/categories')
          .then(res => res.data).catch(() => []),
        
        // Get featured products (best sellers)
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
    } catch (error) {
      console.error('Error loading homepage data:', error);
      return {
        banners: [],
        categories: [],
        featuredProducts: []
      };
    }
  },

  /**
   * Lấy sản phẩm mới nhất
   */
  getNewArrivals: async (limit = 8) => {
    try {
      const response = await axiosInstance.get('/products', {
        params: {
          sortBy: 'newest',
          limit
        }
      });
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      return [];
    }
  },

  /**
   * Lấy sản phẩm bán chạy
   */
  getBestSellers: async (limit = 8) => {
    try {
      const response = await axiosInstance.get('/products', {
        params: {
          sortBy: 'newest',
          limit
        }
      });
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      return [];
    }
  },

  /**
   * Lấy sản phẩm đang sale
   */
  getSaleProducts: async (limit = 8) => {
    try {
      const response = await axiosInstance.get('/products', {
        params: {
          sortBy: 'price-desc',
          limit
        }
      });
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching sale products:', error);
      return [];
    }
  }
};

export default homeService;
