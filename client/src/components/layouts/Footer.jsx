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

      <div className="container mx-auto px-4 lg:px-28 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-black tracking-tighter uppercase italic">MINHTUANSHOP</span>
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

          {/* Links Sections */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8">Cửa hàng</h4>
            <ul className="space-y-4">
              {footerLinks.shop.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-gray-400 hover:text-white text-sm transition-colors tracking-wide">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8">Hỗ trợ</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-gray-400 hover:text-white text-sm transition-colors tracking-wide">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8">Thông tin</h4>
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
                <span className="text-sm tracking-wide">support@minhtuanshop.vn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-8 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 lg:px-28">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">
              © {currentYear} MINHTUANSHOP. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-6 text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">
              <Link to="/about" className="hover:text-white transition-colors">Về chúng tôi</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Liên hệ</Link>
              <span className="text-gray-700">|</span>
              <p className="text-gray-400">
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

