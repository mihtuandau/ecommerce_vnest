import React, { useState } from 'react';
import Layout from '../../../components/layouts/Layout';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebookF, FaInstagram, FaTwitter, FaPaperPlane } from 'react-icons/fa';
import { notify } from '../../../utils/notification';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      notify.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-30">
          {/* Breadcrumb */}
          <Breadcrumb items={[
            { label: 'Liên hệ' }
          ]} />

          {/* Hero Section - Minimalist */}
          <div className="border-b border-gray-200 pb-12 md:pb-16 mb-16 md:mb-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-tight">
                Liên Hệ Với Chúng Tôi
              </h1>
              <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
              </p>
            </div>
          </div>

          {/* Contact Info Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
            <div className="border border-gray-200 p-6 md:p-8 group hover:border-gray-900 transition-colors duration-300">
              <div className="w-12 h-12 border border-gray-900 flex items-center justify-center mb-5 md:mb-6">
                <FaPhone className="text-gray-900 text-lg" />
              </div>
              <h3 className="text-base md:text-lg font-normal text-gray-900 mb-2 md:mb-3">Điện Thoại</h3>
              <p className="text-xs md:text-sm text-gray-600 mb-3">Liên hệ chúng tôi qua:</p>
              <a href="tel:+84123456789" className="text-gray-900 hover:text-gray-600 block mb-1 transition-colors">
                +84 123 456 789
              </a>
              <a href="tel:+84987654321" className="text-gray-900 hover:text-gray-600 block transition-colors">
                +84 987 654 321
              </a>
            </div>

            <div className="border border-gray-200 p-6 md:p-8 group hover:border-gray-900 transition-colors duration-300">
              <div className="w-12 h-12 border border-gray-900 flex items-center justify-center mb-5 md:mb-6">
                <FaEnvelope className="text-gray-900 text-lg" />
              </div>
              <h3 className="text-base md:text-lg font-normal text-gray-900 mb-2 md:mb-3">Email</h3>
              <p className="text-xs md:text-sm text-gray-600 mb-3">Gửi email cho chúng tôi:</p>
              <a href="mailto:support@minhtuanstore.com" className="text-gray-900 hover:text-gray-600 block mb-1 transition-colors">
                support@minhtuanstore.com
              </a>
              <a href="mailto:info@minhtuanstore.com" className="text-gray-900 hover:text-gray-600 block transition-colors">
                info@minhtuanstore.com
              </a>
            </div>

            <div className="border border-gray-200 p-6 md:p-8 group hover:border-gray-900 transition-colors duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 border border-gray-900 flex items-center justify-center mb-5 md:mb-6">
                <FaMapMarkerAlt className="text-gray-900 text-lg" />
              </div>
              <h3 className="text-base md:text-lg font-normal text-gray-900 mb-2 md:mb-3">Địa Chỉ</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                123 Nguyễn Văn Linh,<br />
                Quận 7, TP. Hồ Chí Minh,<br />
                Việt Nam
              </p>
            </div>
          </div>

          {/* Contact Form & Info */}
          <div className="grid lg:grid-cols-3 gap-10 md:gap-12 lg:gap-16 mb-16 md:mb-20">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
                Gửi Tin Nhắn Cho Chúng Tôi
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-normal text-gray-900 mb-2">
                      Họ và tên <span className="text-gray-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-normal text-gray-900 mb-2">
                      Email <span className="text-gray-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-normal text-gray-900 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                      placeholder="0123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-normal text-gray-900 mb-2">
                      Chủ đề <span className="text-gray-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                      placeholder="Hỗ trợ đơn hàng"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-normal text-gray-900 mb-2">
                    Nội dung <span className="text-gray-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={7}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors resize-none"
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#00a85a] hover:bg-[#008f4d] text-white font-normal py-3 md:py-4 px-6 md:px-8 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 text-sm md:text-base"
                  >
                    <FaPaperPlane className="text-xs md:text-sm" />
                    {loading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                  </button>
                </div>
              </form>
            </div>

            {/* Additional Info */}
            <div className="lg:col-span-1 space-y-10 md:space-y-12">
              {/* Working Hours */}
              <div className="border-t border-gray-200 pt-8 lg:pt-0 lg:border-t-0">
                <div className="flex items-center gap-3 mb-5 md:mb-6">
                  <div className="w-10 h-10 border border-[#00a85a] flex items-center justify-center">
                    <FaClock className="text-[#00a85a] text-base" />
                  </div>
                  <h3 className="text-base md:text-lg font-normal text-gray-900">Giờ Làm Việc</h3>
                </div>
                <div className="space-y-2.5 md:space-y-3 text-xs md:text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Thứ 2 - Thứ 6:</span>
                    <span className="text-gray-900">8:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thứ 7:</span>
                    <span className="text-gray-900">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chủ nhật:</span>
                    <span className="text-gray-900">9:00 - 17:00</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="border-t border-gray-200 pt-8 md:pt-10">
                <h3 className="text-base md:text-lg font-normal text-gray-900 mb-2 md:mb-3">Kết Nối Với Chúng Tôi</h3>
                <p className="mb-5 md:mb-6 text-xs md:text-sm text-gray-600 leading-relaxed">Theo dõi chúng tôi trên các nền tảng mạng xã hội</p>
                <div className="flex gap-2.5 md:gap-3">
                  <a 
                    href="#" 
                    className="w-12 h-12 border border-gray-300 hover:border-[#00a85a] hover:bg-[#00a85a] flex items-center justify-center transition-all duration-300 group"
                  >
                    <FaFacebookF className="text-gray-900 group-hover:text-white transition-colors" />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 border border-gray-300 hover:border-[#00a85a] hover:bg-[#00a85a] flex items-center justify-center transition-all duration-300 group"
                  >
                    <FaInstagram className="text-gray-900 group-hover:text-white transition-colors" />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 border border-gray-300 hover:border-[#00a85a] hover:bg-[#00a85a] flex items-center justify-center transition-all duration-300 group"
                  >
                    <FaTwitter className="text-gray-900 group-hover:text-white transition-colors" />
                  </a>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="border-t border-gray-200 pt-8 md:pt-10">
                <h3 className="text-base md:text-lg font-normal text-gray-900 mb-2">Có Câu Hỏi?</h3>
                <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed">
                  Xem các câu hỏi thường gặp hoặc trò chuyện trực tiếp với chúng tôi
                </p>
                <a 
                  href="#" 
                  className="text-gray-900 hover:text-gray-600 text-xs md:text-sm inline-flex items-center gap-2 transition-colors"
                >
                  Xem FAQ
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="border-t border-gray-200 pt-16 md:pt-20 pb-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
              Vị Trí Của Chúng Tôi
            </h2>
            <div className="bg-gray-100 overflow-hidden">
              <div className="h-[350px] md:h-[450px] lg:h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2045.7779759982486!2d106.77527522956257!3d10.880097390426545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d88434bd9e2f%3A0xbeb0f3f0acf1059d!2zMTA5LzQ3LzNBIMSQLiBT4buRIDgsIExpbmggWHXDom4sIFRo4bunIMSQ4bupYywgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e1!3m2!1svi!2s!4v1765561169869!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Store Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;