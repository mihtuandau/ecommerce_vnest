import React from "react";
import { Card, Row, Col, Divider, Timeline } from "antd";
import { ShopOutlined, RocketOutlined, CustomerServiceOutlined, SafetyOutlined, TeamOutlined, HeartOutlined } from "@ant-design/icons";
import Layout from "../../../components/layouts/Layout";
import Breadcrumb from "../../../components/common/Breadcrumb";

const AboutPage = () => {
  return (
    <Layout >
      <div className="min-h-screen bg-gray-50 pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-30">
          <Breadcrumb items={[{ label: "Về chúng tôi" }]} />

          <h1 className="text-3xl font-bold text-gray-900 pt-4 pb-4">VỀ CHÚNG TÔI</h1>

          {/* Story Section */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 md:mb-28">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
                Câu Chuyện Của Chúng Tôi
              </h2>
              <div className="space-y-5 md:space-y-6 text-gray-700 leading-relaxed text-[15px] md:text-base">
                <p>
                  MINH TUAN STORE được thành lập với sứ mệnh mang đến những sản
                  phẩm thời trang chất lượng cao, phong cách hiện đại với giá cả
                  hợp lý cho người tiêu dùng Việt Nam.
                </p>
                <p>
                  Chúng tôi tin rằng thời trang không chỉ là quần áo, mà là cách
                  bạn thể hiện bản thân, là niềm tự hào và sự tự tin trong từng
                  bước đi. Với đội ngũ nhân viên nhiệt huyết và am hiểu xu
                  hướng, chúng tôi luôn cập nhật những mẫu mã mới nhất, phù hợp
                  với mọi lứa tuổi và phong cách.
                </p>
                <p>
                  Hơn cả việc kinh doanh, chúng tôi mong muốn xây dựng một cộng
                  đồng yêu thời trang, nơi mọi người có thể tìm thấy phong cách
                  riêng của mình và tỏa sáng theo cách của riêng họ.
                </p>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                  alt="Store"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white p-5 md:p-6 shadow-sm">
                <div className="text-4xl md:text-5xl font-light text-gray-900">
                  5+
                </div>
                <div className="text-xs md:text-sm text-gray-600 mt-1 uppercase tracking-wide">
                  Năm Kinh Nghiệm
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20 md:mb-28">
            <div className="max-w-2xl mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 mb-4 md:mb-5 tracking-tight">
                Giá Trị Cốt Lõi
              </h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Những giá trị mà chúng tôi luôn hướng tới trong mọi hoạt động
                kinh doanh
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
              <Card bordered={false} className="shadow-sm">
                <div className="w-12 h-12 border border-[#00a85a] flex items-center justify-center mb-5 md:mb-6 group-hover:bg-[#00a85a] transition-colors duration-300">
                  <SafetyOutlined className="text-[#00a85a] text-lg group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg md:text-xl font-normal text-gray-900 mb-3 md:mb-4">
                  Chất Lượng
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Cam kết mang đến sản phẩm chất lượng cao, được kiểm định kỹ
                  lưỡng từ nguồn gốc đến khi đến tay khách hàng.
                </p>
              </Card>

              <Card bordered={false} className="shadow-sm">
                <div className="w-12 h-12 border border-[#00a85a] flex items-center justify-center mb-5 md:mb-6 group-hover:bg-[#00a85a] transition-colors duration-300">
                  <TeamOutlined className="text-[#00a85a] text-lg group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg md:text-xl font-normal text-gray-900 mb-3 md:mb-4">
                  Khách Hàng Là Trung Tâm
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Luôn lắng nghe và đặt nhu cầu của khách hàng lên hàng đầu,
                  mang đến trải nghiệm mua sắm tuyệt vời nhất.
                </p>
              </Card>

              <Card bordered={false} className="shadow-sm">
                <div className="w-12 h-12 border border-[#00a85a] flex items-center justify-center mb-5 md:mb-6 group-hover:bg-[#00a85a] transition-colors duration-300">
                  <HeartOutlined className="text-[#00a85a] text-lg group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg md:text-xl font-normal text-gray-900 mb-3 md:mb-4">
                  Đam Mê Thời Trang
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Đội ngũ của chúng tôi luôn cháy hết mình với niềm đam mê thời
                  trang, không ngừng học hỏi và cập nhật xu hướng mới.
                </p>
              </Card>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="border-t border-gray-200 pt-16 md:pt-20 mb-20 md:mb-28">
            <div className="max-w-2xl mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 mb-0 tracking-tight">
                Tại Sao Chọn Chúng Tôi?
              </h2>
            </div>

            <Row gutter={[32, 32]}>
              <Col xs={12} lg={6}>
                <Card bordered={false} className="text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 border border-gray-300 flex items-center justify-center mb-4 md:mb-5 mx-auto">
                    <ShopOutlined className="text-lg md:text-xl text-gray-900" />
                  </div>
                  <h3 className="text-sm md:text-base font-normal text-gray-900 mb-2 md:mb-3">
                    Đa Dạng Sản Phẩm
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Hàng nghìn sản phẩm từ nhiều thương hiệu uy tín
                  </p>
                </Card>
              </Col>

              <Col xs={12} lg={6}>
                <Card bordered={false} className="text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 border border-gray-300 flex items-center justify-center mb-4 md:mb-5 mx-auto">
                    <RocketOutlined className="text-lg md:text-xl text-gray-900" />
                  </div>
                  <h3 className="text-sm md:text-base font-normal text-gray-900 mb-2 md:mb-3">
                    Giao Hàng Nhanh
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Giao hàng toàn quốc, nhanh chóng và an toàn
                  </p>
                </Card>
              </Col>

              <Col xs={12} lg={6}>
                <Card bordered={false} className="text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 border border-gray-300 flex items-center justify-center mb-4 md:mb-5 mx-auto">
                    <CustomerServiceOutlined className="text-lg md:text-xl text-gray-900" />
                  </div>
                  <h3 className="text-sm md:text-base font-normal text-gray-900 mb-2 md:mb-3">
                    Hỗ Trợ 24/7
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn
                  </p>
                </Card>
              </Col>

              <Col xs={12} lg={6}>
                <Card bordered={false} className="text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 border border-gray-300 flex items-center justify-center mb-4 md:mb-5 mx-auto">
                    <SafetyOutlined className="text-lg md:text-xl text-gray-900" />
                  </div>
                  <h3 className="text-sm md:text-base font-normal text-gray-900 mb-2 md:mb-3">
                    Đổi Trả Dễ Dàng
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Chính sách đổi trả trong vòng 7 ngày
                  </p>
                </Card>
              </Col>
            </Row>
          </div>

          {/* CTA Section - Minimalist */}
          <div className="border-t border-gray-200 pt-16 md:pt-20 pb-8 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 mb-4 md:mb-5 tracking-tight">
              Sẵn Sàng Khám Phá Bộ Sưu Tập Của Chúng Tôi?
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
              Hãy để chúng tôi giúp bạn tìm thấy phong cách hoàn hảo cho riêng
              mình
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <a
                href="/products"
                className="inline-block bg-[#00a85a] hover:bg-[#008f4d] text-white px-8 py-4 font-normal transition-colors duration-300"
              >
                Mua Sắm Ngay
              </a>
              <a
                href="/contact"
                className="inline-block bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 font-normal border border-gray-900 transition-colors duration-300"
              >
                Liên Hệ Chúng Tôi
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
