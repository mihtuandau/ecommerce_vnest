import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ProductCard from "../products/ProductCard";

const BestSellingProducts = ({ products = [] }) => {
  const navigate = useNavigate();

  if (!products || products.length === 0) return null;

  const displayProducts = products.slice(0, 8);

  return (
    <section className="py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {}
        <div className="flex flex-col mb-12 items-center text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-orange-500 font-semibold mb-3 block">
            Trending Now
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 tracking-tighter uppercase mb-4">
            SẢN PHẨM BÁN CHẠY
          </h2>
          <div className="h-1 w-20 bg-orange-500 rounded-full"></div>
        </div>

        {}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {}
        <div className="mt-12 flex justify-center">
          <Link
            to="/products?sort=sold"
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-slate-800 transition-colors"
          >
            XEM TẤT CẢ
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

export default BestSellingProducts;






