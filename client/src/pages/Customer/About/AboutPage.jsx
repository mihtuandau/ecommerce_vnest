import React from 'react';
import Layout from '../../../components/layouts/Layout';
import { FaStore, FaShippingFast, FaHeadset, FaShieldAlt, FaUsers, FaHeart } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <a href="/" className="hover:text-white transition-colors">Trang chủ</a>
              <span>›</span>
              <span className="text-white font-medium">Về chúng tôi</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Về Chúng Tôi</h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              MINH TUAN STORE - Điểm đến tin cậy cho phong cách thời trang hiện đại
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="container mx-auto px-4 max-w-6xl py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Câu Chuyện Của Chúng Tôi</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                MINH TUAN STORE được thành lập với sứ mệnh mang đến những sản phẩm thời trang chất lượng cao, 
                phong cách hiện đại với giá cả hợp lý cho người tiêu dùng Việt Nam.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Chúng tôi tin rằng thời trang không chỉ là quần áo, mà là cách bạn thể hiện bản thân, 
                là niềm tự hào và sự tự tin trong từng bước đi. Với đội ngũ nhân viên nhiệt huyết và 
                am hiểu xu hướng, chúng tôi luôn cập nhật những mẫu mã mới nhất, phù hợp với mọi lứa tuổi 
                và phong cách.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Hơn cả việc kinh doanh, chúng tôi mong muốn xây dựng một cộng đồng yêu thời trang, 
                nơi mọi người có thể tìm thấy phong cách riêng của mình và tỏa sáng theo cách của riêng họ.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" 
                alt="Store" 
                className="rounded-lg shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-gray-900 text-white p-6 rounded-lg shadow-xl">
                <div className="text-4xl font-bold">5+</div>
                <div className="text-sm">Năm Kinh Nghiệm</div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Giá Trị Cốt Lõi</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Những giá trị mà chúng tôi luôn hướng tới trong mọi hoạt động kinh doanh
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaShieldAlt className="text-gray-900 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Chất Lượng</h3>
                <p className="text-gray-600 leading-relaxed">
                  Cam kết mang đến sản phẩm chất lượng cao, được kiểm định kỹ lưỡng từ nguồn gốc 
                  đến khi đến tay khách hàng.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaUsers className="text-gray-900 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Khách Hàng Là Trung Tâm</h3>
                <p className="text-gray-600 leading-relaxed">
                  Luôn lắng nghe và đặt nhu cầu của khách hàng lên hàng đầu, mang đến trải nghiệm 
                  mua sắm tuyệt vời nhất.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaHeart className="text-gray-900 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Đam Mê Thời Trang</h3>
                <p className="text-gray-600 leading-relaxed">
                  Đội ngũ của chúng tôi luôn cháy hết mình với niềm đam mê thời trang, không ngừng 
                  học hỏi và cập nhật xu hướng mới.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-12 text-center">Tại Sao Chọn Chúng Tôi?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStore className="text-3xl text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Đa Dạng Sản Phẩm</h3>
                <p className="text-gray-300 text-sm">
                  Hàng nghìn sản phẩm từ nhiều thương hiệu uy tín
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShippingFast className="text-3xl text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Giao Hàng Nhanh</h3>
                <p className="text-gray-300 text-sm">
                  Giao hàng toàn quốc, nhanh chóng và an toàn
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHeadset className="text-3xl text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Hỗ Trợ 24/7</h3>
                <p className="text-gray-300 text-sm">
                  Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShieldAlt className="text-3xl text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Đổi Trả Dễ Dàng</h3>
                <p className="text-gray-300 text-sm">
                  Chính sách đổi trả trong vòng 7 ngày
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-100 py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sẵn Sàng Khám Phá Bộ Sưu Tập Của Chúng Tôi?
            </h2>
            <p className="text-gray-600 mb-8">
              Hãy để chúng tôi giúp bạn tìm thấy phong cách hoàn hảo cho riêng mình
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="/products" 
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Mua Sắm Ngay
              </a>
              <a 
                href="/contact" 
                className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-lg font-semibold border-2 border-gray-300 transition-colors"
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
