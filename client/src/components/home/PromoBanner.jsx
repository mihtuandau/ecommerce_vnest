import { Link } from 'react-router-dom';

const PromoBanner = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col mb-14 items-center text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black mb-3 block">
            Ưu đãi đặc biệt
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase mb-4">
            BỘ SƯU TẬP ĐỘC QUYỀN
          </h2>
          <div className="h-1 w-20 bg-gray-900 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Large Promo */}
          <Link 
            to="/products" 
            className="relative overflow-hidden h-[500px] group cursor-pointer block"
          >
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04"
              alt="Bộ Sưu Tập Mùa Hè 2024"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-center">
              <span className="inline-block w-fit px-4 py-2 bg-white text-gray-900 text-xs uppercase tracking-wider mb-6">
                New Collection
              </span>
              <h2 className="text-4xl lg:text-5xl font-light text-white mb-4">
                Bộ Sưu Tập<br/>Mùa Hè 2024
              </h2>
              <p className="text-base text-gray-200 mb-8 max-w-md">
                Khám phá những thiết kế thời trang mới nhất, phong cách và năng động
              </p>
              <span className="w-fit px-8 py-3 bg-white text-black hover:bg-gray-100 text-[10px] uppercase tracking-widest font-bold transition-all border border-transparent hover:border-black">
                Khám Phá Ngay
              </span>

            </div>
          </Link>

          {/* Two Small Promos */}
          <div className="space-y-6">
            <Link 
              to="/products" 
              className="relative overflow-hidden h-[238px] group cursor-pointer block"
              >
                <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
                alt="Phụ Kiện Cao Cấp"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
              <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-light text-white mb-3">
                  Phụ Kiện Cao Cấp
                </h3>
                <p className="text-white/90 mb-4 text-sm">
                  <span className="bg-white text-gray-900 px-2 py-1 text-xs uppercase tracking-wide mr-2">
                    -40%
                  </span>
                  Giảm giá lên đến 40%
                </p>
                <span className="w-fit px-6 py-2 bg-white text-black hover:bg-gray-100 text-[10px] uppercase tracking-widest font-bold transition-all border border-transparent hover:border-black">
                  Mua Ngay
                </span>

              </div>
            </Link>

            <Link 
              to="/products" 
              className="relative overflow-hidden h-[238px] group cursor-pointer block"
            >
              <img
                src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2"
                alt="Giày Thể Thao"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
              <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-light text-white mb-3">
                  Giày Thể Thao
                </h3>
                <p className="text-white/90 mb-4 text-sm">
                  <span className="bg-white text-gray-900 px-2 py-1 text-xs uppercase tracking-wide mr-2">
                    Trend
                  </span>
                  Xu hướng 2024
                </p>
                <span className="w-fit px-6 py-2 bg-white text-black hover:bg-gray-100 text-[10px] uppercase tracking-widest font-bold transition-all border border-transparent hover:border-black">
                  Xem Ngay
                </span>

              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default PromoBanner;
