import React from "react";
import { formatPrice } from "../../../utils/formatters";

const TopProducts = ({ products }) => {
  return (
    <div className="bg-white rounded-2xl p-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col h-full hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 tracking-tight">
          Top sản phẩm bán chạy
        </h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
          Xem tất cả &rarr;
        </button>
      </div>

      <div className="flex flex-col p-4 w-full h-[400px] overflow-y-auto custom-scrollbar">
        {products && products.length > 0 ? (
          products.slice(0, 5).map((item, index) => {
            const rating = "4.8";
            const image =
              item.product.thumbnail || "https://via.placeholder.com/60";

            // Định dạng doanh thu linh hoạt
            const revenueFormatted =
              item.totalRevenue >= 1000000
                ? (item.totalRevenue / 1000000).toLocaleString("vi-VN", {
                    minimumFractionDigits: 1,
                  }) + "Mđ"
                : formatPrice(item.totalRevenue);

            return (
              <div
                key={item.product.id || index}
                className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer mb-2 gap-4"
              >
                <div className="w-6 flex justify-center">
                  <span
                    className={`text-base font-bold ${
                      index === 0
                        ? "text-yellow-500"
                        : index === 1
                          ? "text-gray-400"
                          : index === 2
                            ? "text-amber-600"
                            : "text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-[15px] font-semibold text-gray-800 truncate mb-0.5">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center text-xs gap-1.5">
                    <span className="font-bold text-blue-600">
                      {formatPrice(item.product.price)}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">
                      {item.totalSold} đã bán
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase text-gray-400 font-bold mb-0.5 tracking-wider">
                    Doanh thu
                  </p>
                  <span className="font-bold text-gray-800 text-sm">
                    {revenueFormatted}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500 py-10">
            Không có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProducts;
