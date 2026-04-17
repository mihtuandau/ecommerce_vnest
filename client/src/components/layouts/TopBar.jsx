import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaPhoneAlt, FaTruck, FaUndo, FaPercentage } from 'react-icons/fa';

const PROMOTIONS = [
  { icon: <FaPercentage size={12} />, text: 'Giảm giá cực sốc lên đến 50% toàn bộ mẫu hè!' },
  { icon: <FaTruck size={12} />, text: 'Miễn phí vận chuyển cho đơn hàng từ 500k.' },
  { icon: <FaUndo size={12} />, text: 'Đổi trả dễ dàng trong vòng 7 ngày.' },
];

const TopBar = () => {
  const [promoIndex, setPromoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % PROMOTIONS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black text-white hidden lg:block overflow-hidden border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between text-[11px] font-medium tracking-wide">
        {}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 hover:text-gray-300 transition-colors cursor-pointer">
            <FaPhoneAlt size={10} className="text-gray-400" />
            <span>Hotline: 1900-1234</span>
          </div>
          <div className="w-px h-3 bg-white/20" />
          <div className="hover:text-gray-300 transition-colors cursor-pointer">
            Hỗ trợ khách hàng
          </div>
        </div>

        {}
        <div className="flex-1 max-w-md mx-auto relative h-full flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={promoIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex items-center gap-2 text-white uppercase font-bold text-[10px] tracking-widest"
            >
              <span className="text-gray-400">{PROMOTIONS[promoIndex].icon}</span>
              <span>{PROMOTIONS[promoIndex].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {}
        <div className="flex items-center gap-4 text-white/70">
          <span className="hover:text-white transition-colors cursor-pointer px-2 py-0.5 bg-white/10 rounded border border-white/20 hover:bg-white/20">Theo dõi đơn hàng</span>
        </div>
      </div>
    </div>

  );
};

export default TopBar;







