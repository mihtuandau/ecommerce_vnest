import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Spin, Result, Button as AntButton } from "antd";
import { ReloadOutlined, WarningOutlined } from "@ant-design/icons";
import Layout from "../../../components/layouts/Layout";
import HeroBanner from "../../../components/home/HeroBanner";
import FeaturedCategories from "../../../components/home/FeaturedCategories";
import FeaturedProducts from "../../../components/home/FeaturedProducts";
import BestSellingProducts from "../../../components/home/BestSellingProducts";
import PromoBanner from "../../../components/home/PromoBanner";
import Loading from "../../../components/common/Loading";
// import Features from "../../../components/home/Features";
import { useHomeData } from "../../../hooks/useHomeData";
import { useAuth } from "../../../contexts/authContext";
import authService from "../../../services/authService";
import { notify } from "../../../utils/notification";
// import toast from "react-hot-toast";

const HomePage = () => {
  const { data: homeData, loading, error } = useHomeData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const oauthSuccess = searchParams.get("oauth_success");

    if (oauthSuccess === "true") {
      const fetchUser = async () => {
        try {
          const user = await authService.verifyAuth();
          if (user) {
            setUser(user);
            notify.success("Đăng nhập Google thành công!");
          }
        } catch (error) {
          notify.error("Lỗi khi xác thực người dùng");
        }
      };

      fetchUser();

      navigate("/", { replace: true });
    }
  }, [searchParams, navigate, setUser]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Result
            status="error"
            icon={<WarningOutlined />}
            title="Có lỗi xảy ra"
            subTitle={error}
            extra={
              <AntButton 
                type="primary" 
                icon={<ReloadOutlined />}
                onClick={() => window.location.reload()}
              >
                Thử lại
              </AntButton>
            }
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeroBanner slides={homeData.banners} />
      <div className="">
        <FeaturedCategories categories={homeData.categories} />
        <BestSellingProducts products={homeData.bestSellers} />
        <FeaturedProducts products={homeData.featuredProducts} />
        <PromoBanner />
      </div>
    </Layout>
  );
};

export default HomePage;
