import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Spin, Result, Button as AntButton } from "antd";
import { ReloadOutlined, WarningOutlined } from "@ant-design/icons";
import Layout from "../../../components/layouts/Layout";
import HeroBanner from "../../../components/home/HeroBanner";
import FeaturedCategories from "../../../components/home/FeaturedCategories";
import FeaturedProducts from "../../../components/home/FeaturedProducts";
import BestSellingProducts from "../../../components/home/BestSellingProducts";
import FlashSale from "../../../components/home/FlashSale";
import PromoBanner from "../../../components/home/PromoBanner";
import Loading from "../../../components/common/Loading";
import WelcomeModal from "../../../components/common/WelcomeModal";
import { useHomeData } from "../../../hooks/useHomeData";
import { useAuth } from "../../../contexts/AuthContext";
import authService from "../../../services/authService";
import BrandSection from "../../../components/home/BrandSection";
import TopRatedProducts from "../../../components/home/TopRatedProducts";

const HomePage = () => {
  const { data: homeData, isLoading, error, refetch } = useHomeData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {

  }, [showWelcomeModal]);

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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Spin size="large" spinning={true} tip="Đang tải dữ liệu...">
            <div className="p-10" />
          </Spin>
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
            subTitle={error?.message || "Không thể tải dữ liệu"}
            extra={
              <AntButton 
                type="primary" 
                icon={<ReloadOutlined />}
                onClick={() => refetch()}
              >
                Thử lại
              </AntButton>
            }
          />
        </div>
      </Layout>
    );
  }

  if (!homeData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Spin size="large" spinning={true} tip="Đang tải dữ liệu...">
            <div className="p-10" />
          </Spin>
        </div>
      </Layout>
    );
  }


  return (
    <>
      {}
      <Layout>
        <HeroBanner slides={homeData.banners || []} />
        
        <div className="">
          <FeaturedCategories categories={homeData.categories || []} />
          
          <FlashSale />
          
          <BestSellingProducts products={homeData.bestSellers || []} />
          
          <BrandSection />
          
          <FeaturedProducts products={homeData.featuredProducts || []} />

          <TopRatedProducts products={homeData.featuredProducts || []} />
          
          <PromoBanner />
        </div>
      </Layout>
    </>
  );
};



export default HomePage;






