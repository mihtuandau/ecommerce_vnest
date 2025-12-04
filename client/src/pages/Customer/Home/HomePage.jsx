import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../../../components/layouts/Layout";
import HeroBanner from "../../../components/home/HeroBanner";
import FeaturedCategories from "../../../components/home/FeaturedCategories";
import FeaturedProducts from "../../../components/home/FeaturedProducts";
import PromoBanner from "../../../components/home/PromoBanner";
import Features from "../../../components/home/Features";
import { useHomeData } from "../../../hooks/useHomeData";
import toast from "react-hot-toast";

const HomePage = () => {
  const { data: homeData, loading, error } = useHomeData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Handle Google OAuth callback
  useEffect(() => {
    const googleToken = searchParams.get("google_token");
    const userData = searchParams.get("user_data");

    if (googleToken) {
      // Store token
      localStorage.setItem("token", googleToken);

      // Decode and store user data
      if (userData) {
        try {
          const decodedUser = JSON.parse(atob(userData));
          localStorage.setItem("user", JSON.stringify(decodedUser));
        } catch (error) {
          console.error("Failed to decode user data:", error);
        }
      }

      toast.success("Đăng nhập Google thành công!");

      const redirectUrl = localStorage.getItem("redirectAfterLogin");

      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin");
        // Use setTimeout to ensure redirect happens after all state updates
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 100);
      } else {
        // No redirect URL, just clean up query params and stay on home
        navigate("/", { replace: true });
      }
    }
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
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
    </Layout>
  );
};

export default HomePage;
