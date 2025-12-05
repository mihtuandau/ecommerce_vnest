// src/pages/Customer/Home/HomePage.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../../../components/layouts/Layout";
import HeroBanner from "../../../components/home/HeroBanner";
import FeaturedCategories from "../../../components/home/FeaturedCategories";
import FeaturedProducts from "../../../components/home/FeaturedProducts";
import PromoBanner from "../../../components/home/PromoBanner";
import Features from "../../../components/home/Features";
import { useHomeData } from "../../../hooks/useHomeData";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";

const HomePage = () => {
  const { data: homeData, loading, error } = useHomeData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth(); // ✅ Lấy setUser từ context

  // Handle Google OAuth callback
  useEffect(() => {
    const oauthSuccess = searchParams.get('oauth_success');
    const encodedUser = searchParams.get('user_data');

    if (oauthSuccess === 'true' && encodedUser) {
      try {
        // Decode user data
        const decodedUser = JSON.parse(atob(encodedUser));
        
        // 🔒 Token đã được lưu trong httpOnly cookie bởi backend
        // Chỉ lưu user info vào localStorage
        localStorage.setItem('user', JSON.stringify(decodedUser));
        
        // Update AuthContext state
        setUser(decodedUser);
        
        toast.success('Đăng nhập Google thành công!');
        
        // Clean URL
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Failed to decode user data:', error);
        toast.error('Lỗi khi xử lý dữ liệu người dùng');
      }
    }
  }, [searchParams, navigate, setUser]);

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Banner - Full width, no padding */}
      <div className="-mt-[104px]">
        <HeroBanner slides={homeData.banners} />
      </div>

      {/* Features */}
      <Features />

      {/* Featured Categories */}
      <FeaturedCategories categories={homeData.categories} />

      {/* Featured Products */}
      <FeaturedProducts products={homeData.featuredProducts} />

      {/* Promo Banner */}
      <PromoBanner />

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Đăng Ký Nhận Tin Mới Nhất
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Nhận ngay mã giảm giá 10% cho đơn hàng đầu tiên và cập nhật các ưu đãi mới nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-6 py-3 rounded-full border-0 focus:ring-2 focus:ring-white/50 outline-none"
            />
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
              Đăng Ký
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;