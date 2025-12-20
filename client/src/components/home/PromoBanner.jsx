import Button from '../common/Button';

const PromoBanner = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 stagger-children">
          {/* Large Promo */}
          <div className="relative overflow-hidden h-[500px] group cursor-pointer card-glow">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04"
              alt="Summer Collection"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-300" />
            <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-center">
              <span className="inline-block w-fit px-4 py-1 bg-white text-gray-900 text-sm font-bold mb-4 animate-float">
                NEW COLLECTION
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 group-hover:translate-x-2 transition-transform duration-300">
                Bộ Sưu Tập<br />Mùa Hè 2024
              </h2>
              <p className="text-lg text-gray-200 mb-6 max-w-md opacity-90 group-hover:opacity-100 transition-opacity">
                Khám phá những thiết kế thời trang mới nhất, phong cách và năng động
              </p>
              <Button className="btn-shine w-fit px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                Khám Phá Ngay
              </Button>
            </div>
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Two Small Promos */}
          <div className="space-y-6">
            {/* Promo 1 */}
            <div className="relative overflow-hidden h-[238px] group cursor-pointer card-glow">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
                alt="Accessories"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent group-hover:from-gray-900/90 transition-all duration-300" />
              <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                  Phụ Kiện Cao Cấp
                </h3>
                <p className="text-white/90 mb-4">
                  <span className="bg-red-500 text-white px-2 py-1 text-sm font-bold mr-2">-40%</span>
                  Giảm giá lên đến 40%
                </p>
                <Button className="btn-shine w-fit px-6 py-2 bg-white text-gray-900 hover:bg-gray-100 font-semibold text-sm hover:-translate-y-1 transition-all duration-300">
                  Mua Ngay
                </Button>
              </div>
            </div>

            {/* Promo 2 */}
            <div className="relative overflow-hidden h-[238px] group cursor-pointer card-glow">
              <img
                src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2"
                alt="Shoes"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent group-hover:from-gray-900/90 transition-all duration-300" />
              <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                  Giày Thể Thao
                </h3>
                <p className="text-white/90 mb-4">
                  <span className="bg-gray-900 border border-white text-white px-2 py-1 text-sm font-bold mr-2">TREND</span>
                  Xu hướng 2024
                </p>
                <Button className="btn-shine w-fit px-6 py-2 bg-white text-gray-900 hover:bg-gray-100 font-semibold text-sm hover:-translate-y-1 transition-all duration-300">
                  Xem Ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
