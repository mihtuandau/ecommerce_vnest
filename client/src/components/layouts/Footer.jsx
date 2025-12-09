import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  ShoppingCart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-gray-900" size={20} />
              </div>
              <span className="text-2xl font-bold text-white">SHOP</span>
            </div>
            <p className="text-sm mb-4">
              Cửa hàng thời trang trực tuyến hàng đầu Việt Nam. 
              Chất lượng - Uy tín - Giá tốt.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-gray-900 rounded-full flex items-center justify-center transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-gray-900 rounded-full flex items-center justify-center transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-gray-900 rounded-full flex items-center justify-center transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-gray-900 rounded-full flex items-center justify-center transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liên Kết</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Sản Phẩm
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Liên Hệ
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">
                  Tuyển Dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Hỗ Trợ</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/order-lookup" className="hover:text-white transition-colors flex items-center gap-2">
                  🔍 Tra Cứu Đơn Hàng
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Điều Khoản Sử Dụng
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Câu Hỏi Thường Gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span className="text-sm">
                  109/47 Đương số 8, Linh Xuân, Thủ Đức, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="flex-shrink-0" />
                <span className="text-sm">SĐT: 0325586629</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="flex-shrink-0" />
                <span className="text-sm">dautuan032004@gmail.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-white font-semibold mb-2">Giờ làm việc:</h4>
              <p className="text-sm">Thứ 2 - Thứ 7: 8:00 - 21:00</p>
              <p className="text-sm">Chủ Nhật: 9:00 - 21:00</p>
            </div>
          </div>
        </div>
      </div>

      

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-400">
            <p>© {currentYear} SHOP. All rights reserved.</p>
            <p>
              Designed with by{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">
              Minh Tuấn
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
