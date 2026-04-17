import { Link } from 'react-router-dom';

const rawBrands = [
  { id: 1, name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
  { id: 2, name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
  { id: 3, name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { id: 4, name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { id: 5, name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
  { id: 6, name: 'LG', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg' },
  { id: 7, name: 'Puma', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Puma_Logo.svg' },
  { id: 8, name: 'Dell', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg' },
];

const brands = [...rawBrands, ...rawBrands];

const BrandSection = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {}
        <div className="flex flex-col mb-12 items-center text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-orange-500 font-black mb-3 block">
            Partner Brands
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-4">
            ĐỐI TÁC CỦA CHÚNG TÔI
          </h2>
          <div className="h-1 w-20 bg-[#ff4d15] rounded-full"></div>
        </div>
        
        {}
        <div className="marquee-container relative py-4">
          <div className="animate-marquee flex gap-8 items-center">
            {brands.map((brand, idx) => (
              <div 
                key={`${brand.id}-${idx}`}
                className="group bg-gray-50/50 rounded-2xl px-10 border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center justify-center h-28 w-48 flex-shrink-0 cursor-pointer"
              >
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="max-h-10 w-auto grayscale group-hover:grayscale-0 transition-all duration-500 opacity-40 group-hover:opacity-100 transform group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandSection;






