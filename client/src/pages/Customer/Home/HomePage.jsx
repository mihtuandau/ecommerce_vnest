// src/pages/Customer/Home/HomePage.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../../../components/layouts/Layout";
import HeroBanner from "../../../components/home/HeroBanner";
import FeaturedCategories from "../../../components/home/FeaturedCategories";
import FeaturedProducts from "../../../components/home/FeaturedProducts";
import PromoBanner from "../../../components/home/PromoBanner";
import Loading from "../../../components/common/Loading";
// import Features from "../../../components/home/Features";
import { useHomeData } from "../../../hooks/useHomeData";
import { useAuth } from "../../../contexts/authContext";
import authService from "../../../services/authService";
import toast from "react-hot-toast";

const HomePage = () => {
  const { data: homeData, loading, error } = useHomeData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth(); 

  useEffect(() => {
    const oauthSuccess = searchParams.get('oauth_success');

    if (oauthSuccess === 'true') {
      const fetchUser = async () => {
        try {
          const user = await authService.verifyAuth();
          if (user) {
            setUser(user);
            toast.success('Đăng nhập Google thành công!');
          }
        } catch (error) {
          toast.error('Lỗi khi xác thực người dùng');
        }
      };
      
      fetchUser();

      navigate('/', { replace: true });
    }
  }, [searchParams, navigate, setUser]);

  if (loading) {
    return (
      <Layout>
        <Loading fullScreen text="Đang tải dữ liệu..." />
      </Layout>
    );
  }

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
      <div className="-mt-[104px]">
        <HeroBanner slides={homeData.banners} />
      </div>
      <FeaturedCategories categories={homeData.categories} />
      <FeaturedProducts products={homeData.featuredProducts} />

      <PromoBanner />
    </Layout>
  );
};

export default HomePage;
