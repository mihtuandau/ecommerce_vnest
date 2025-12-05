import { ArrowRight, Tag, TrendingUp, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedCategories = ({ categories = [] }) => {
  const navigate = useNavigate();


  const gradientColors = [
    'from-gray-700 to-gray-900',
    'from-gray-800 to-gray-950', 
    'from-gray-700 to-gray-900',
    'from-gray-800 to-gray-950',
    'from-gray-700 to-gray-900',
    'from-gray-800 to-gray-950',
    'from-gray-700 to-gray-900',
    'from-gray-800 to-gray-950'
  ];

  const tags = ['Hot', 'New', 'Sale', 'Trend'];
  const defaultCategories = [
    {
      id: 1,
      name: 'Thời Trang Nam',
      image: 'https://images.unsplash.com/photo-1490114538077-4ec16fc8b6c9',
      productCount: 120,
      tag: 'Hot',
      color: 'from-gray-700 to-gray-900'
    },
  ];

  // Map categories từ API với default styling
  const displayCategories = categories.length > 0 
    ? categories.map((cat, index) => ({
        id: cat.id,
        name: cat.name,
        image: cat.image || `https://images.unsplash.com/photo-${1490114538077 + index * 100000}`,
        productCount: cat._count?.products || 0,
        tag: tags[index % tags.length],
        color: gradientColors[index % gradientColors.length]
      }))
    : defaultCategories;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Danh Mục Nổi Bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những bộ sưu tập thời trang hot nhất hiện nay
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(`/category/${category.id}`)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 h-[400px]"
            >
              {/* Background Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                {/* Tag */}
                <div className="flex justify-end">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full">
                    {category.tag === 'Hot' && <TrendingUp size={12} />}
                    {category.tag === 'New' && <Star size={12} />}
                    {category.tag === 'Sale' && <Tag size={12} />}
                    {category.tag === 'Trend' && <TrendingUp size={12} />}
                    {category.tag}
                  </span>
                </div>

                {/* Category Info */}
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2 group-hover:translate-y-0 translate-y-2 transition-transform">
                    {category.name}
                  </h3>
                  <p className="text-white/90 text-sm mb-4">
                    {category.productCount}+ sản phẩm
                  </p>
                  <div className="flex items-center gap-2 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Xem ngay <ArrowRight size={18} />
                  </div>
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/20 rounded-2xl transition-colors pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
