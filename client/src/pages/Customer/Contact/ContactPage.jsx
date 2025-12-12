import React, { useState } from 'react';
import Layout from '../../../components/layouts/Layout';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebookF, FaInstagram, FaTwitter, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';

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
      toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
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
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <a href="/" className="hover:text-white transition-colors">Trang chủ</a>
              <span>›</span>
              <span className="text-white font-medium">Liên hệ</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl py-16">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaPhone className="text-gray-900 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Điện Thoại</h3>
              <p className="text-gray-600 mb-2">Liên hệ chúng tôi qua:</p>
              <a href="tel:+84123456789" className="text-blue-600 font-semibold hover:underline block">
                +84 123 456 789
              </a>
              <a href="tel:+84987654321" className="text-blue-600 font-semibold hover:underline block">
                +84 987 654 321
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaEnvelope className="text-gray-900 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-2">Gửi email cho chúng tôi:</p>
              <a href="mailto:support@minhtuanstore.com" className="text-blue-600 font-semibold hover:underline block">
                support@minhtuanstore.com
              </a>
              <a href="mailto:info@minhtuanstore.com" className="text-blue-600 font-semibold hover:underline block">
                info@minhtuanstore.com
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaMapMarkerAlt className="text-gray-900 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Địa Chỉ</h3>
              <p className="text-gray-600">
                123 Nguyễn Văn Linh,<br />
                Quận 7, TP. Hồ Chí Minh,<br />
                Việt Nam
              </p>
            </div>
          </div>

          {/* Contact Form & Info */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gửi Tin Nhắn Cho Chúng Tôi</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="0123456789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Chủ đề <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="Hỗ trợ đơn hàng"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPaperPlane />
                    {loading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                  </button>
                </form>
              </div>
            </div>

            {/* Additional Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Working Hours */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaClock className="text-gray-900" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Giờ Làm Việc</h3>
                </div>
                <div className="space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Thứ 2 - Thứ 6:</span>
                    <span>8:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Thứ 7:</span>
                    <span>8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Chủ nhật:</span>
                    <span>9:00 - 17:00</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gray-900 text-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4">Kết Nối Với Chúng Tôi</h3>
                <p className="mb-6 text-gray-300">Theo dõi chúng tôi trên các nền tảng mạng xã hội</p>
                <div className="flex gap-4">
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <FaFacebookF className="text-xl" />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <FaInstagram className="text-xl" />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <FaTwitter className="text-xl" />
                  </a>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Có Câu Hỏi?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Xem các câu hỏi thường gặp hoặc trò chuyện trực tiếp với chúng tôi
                </p>
                <a 
                  href="#" 
                  className="text-gray-900 font-semibold hover:underline text-sm"
                >
                  Xem FAQ →
                </a>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-[400px] bg-gray-200">
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
