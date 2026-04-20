import { Link } from "react-router-dom";
import { ChevronRight, ArrowUpRight } from "lucide-react";

const FeaturedCategories = ({ categories = [], isLoading = false }) => {

  const Skeleton = () => (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse">
      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto"></div>
    </div>
  );

  const displayCategories =
    categories.length > 0
      ? categories.slice(0, 6)
      : [
          {
            id: 1,
            name: "Điện tử",
            productCount: 24,
            image:
              "https://images.unsplash.com/photo-1526738549149-8e07eca2c1b4?w=200&h=200&fit=crop",
          },
          {
            id: 2,
            name: "Thời trang",
            productCount: 58,
            image:
              "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop",
          },
          {
            id: 3,
            name: "Thể thao",
            productCount: 31,
            image:
              "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop",
          },
          {
            id: 4,
            name: "Sách",
            productCount: 12,
            image:
              "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop",
          },
          {
            id: 5,
            name: "Nhà & Sống",
            productCount: 19,
            image:
              "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&h=200&fit=crop",
          },
          {
            id: 6,
            name: "Làm đẹp",
            productCount: 45,
            image:
              "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop",
          },
        ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col mb-12 items-center text-center animate-fadeIn">
          <span className="text-[10px] uppercase font-semibold tracking-[0.4em] text-black mb-2">
            Khám phá bộ sưu tập
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black uppercase tracking-tight mb-4">
            Danh mục nổi bật
          </h2>
          <div className="h-1.5 w-12 bg-black rounded-full"></div>
        </div>

        <div className="flex overflow-x-auto lg:flex-wrap lg:justify-center gap-6 sm:gap-8 pb-8 -mx-4 px-4 scrollbar-hide snap-x select-none">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => <Skeleton key={i} />)
            : displayCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="group relative bg-white transition-all duration-500 text-center min-w-[140px] sm:min-w-[160px] lg:w-[180px] snap-start"
                >
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gray-50 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500 group-hover:bg-blue-50/50"></div>

                    <div className="relative w-full h-full overflow-hidden rounded-full border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-500">
                      <img
                        src={category.image || "/placeholder-category.jpg"}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-500"></div>
                    </div>

                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                      <ChevronRight size={14} />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-xs sm:text-base font-semibold text-black mb-1 group-hover:text-neutral-800 transition-colors tracking-tight truncate">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <span className="w-1 h-1 bg-gray-200 rounded-full group-hover:bg-neutral-400 transition-colors"></span>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-semibold uppercase tracking-widest whitespace-nowrap">
                        {category.productCount} SẢN PHẨM
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/products"
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            XEM TẤT CẢ DANH MỤC
            <ArrowUpRight
              size={14}
              className="group-hover:rotate-45 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;






