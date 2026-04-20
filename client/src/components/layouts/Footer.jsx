import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaArrowRight,
} from "react-icons/fa";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: "Sản phẩm mới", path: "/products" },
      { label: "Bán chạy nhất", path: "/products" },
      { label: "Flash Sale", path: "/flash-sale" },
      { label: "Bộ sưu tập", path: "/products" },
    ],
    support: [
      { label: "Tra cứu đơn hàng", path: "/order-lookup" },
      { label: "Chính sách đổi trả", path: "/terms" },
      { label: "Chính sách bảo mật", path: "/privacy" },
      { label: "Câu hỏi thường gặp", path: "/faq" },
    ],
    company: [
      { label: "Về chúng tôi", path: "/about" },
      { label: "Tin tức", path: "/blog" },
      { label: "Tuyển dụng", path: "/careers" },
      { label: "Liên hệ", path: "/contact" },
    ],
  };

  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          {}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span style={{ fontFamily: 'Inter, sans-serif' }} className="text-2xl font-black tracking-tighter uppercase">MINHTUANSHOP</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Định hình phong cách thời trang hiện đại với những thiết kế tối giản, tinh tế và dẫn đầu xu hướng.
            </p>
            <div className="flex gap-5">
              {[
                { Icon: FaFacebookF, h: "https://facebook.com" },
                { Icon: FaInstagram, h: "https://instagram.com" },
                { Icon: FaTwitter, h: "https://twitter.com" },
                { Icon: FaYoutube, h: "https://youtube.com" },
              ].map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.h} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <item.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-8">Cửa hàng</h4>
            <ul className="space-y-4">
              {footerLinks.shop.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-8">Hỗ trợ</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-8">Thông tin</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-gray-400 group">
                <HiOutlineLocationMarker size={20} className="shrink-0 mt-0.5 group-hover:text-white transition-colors" />
                <span className="text-sm leading-relaxed">
                  109/47 Đường số 8, Linh Xuân, Thủ Đức, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-4 text-gray-400 group">
                <HiOutlinePhone size={18} className="shrink-0 group-hover:text-white transition-colors" />
                <span className="text-sm">0325.586.629</span>
              </li>
              <li className="flex items-center gap-4 text-gray-400 group">
                <HiOutlineMail size={18} className="shrink-0 group-hover:text-white transition-colors" />
                <span className="text-sm">support@minhtuanshop.vn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {}
      <div className="border-t border-white/10 py-10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[10px] text-gray-500 font-bold tracking-widest text-center sm:text-left">
              © {currentYear} MinhTuanShop. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs text-gray-500 font-bold">
              <Link to="/about" className="hover:text-white transition-colors">Về chúng tôi</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Liên hệ</Link>
              <span className="text-gray-700 hidden sm:inline">|</span>
              <p className="text-gray-400 hidden sm:block">
                Design by <span className="text-white italic">TuanDau</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;







