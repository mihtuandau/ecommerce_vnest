import React from 'react';
import { Eye, ShoppingCart, Star, Box } from 'lucide-react';
import dayjs from 'dayjs';

const ProductSidebar = ({ product, views, sold, rating, reviewCount, totalStock, categoryName, brandName, basePriceFormatted, priceRange }) => {
  const thumbnail = product.images?.[0]?.url || product.variants?.[0]?.images?.[0]?.url || 'https://placehold.co/400x400/f8fafc/94a3b8?text=No+Image';

  return (
    <div className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden aspect-square">
        <img src={thumbnail} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 flex items-center gap-2 bg-white">
          <h3 className="font-bold text-gray-900 text-sm">Hiệu suất</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <Record label="Lượt xem" value={views.toLocaleString()} icon={<Eye size={18}/>} color="blue" />
          <Record label="Đã bán" value={`${sold.toLocaleString()} sản phẩm`} icon={<ShoppingCart size={18}/>} color="emerald" />
          <Record 
            label="Đánh giá" 
            value={
              <div className="flex items-baseline gap-1">
                {Number(rating).toFixed(1)} / 5 <span className="text-xs font-medium text-gray-400">({reviewCount})</span>
              </div>
            } 
            icon={<Star size={18}/>} 
            color="orange" 
          />
          <Record 
            label="Tồn kho" 
            value={
              <div>
                {totalStock.toLocaleString()} <span className="text-xs font-medium text-gray-400">· {product.variants?.length || 0} biến thể</span>
              </div>
            } 
            icon={<Box size={18}/>} 
            color="purple" 
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 flex items-center gap-2 bg-white">
          <h3 className="font-bold text-gray-900 text-sm">Thông tin sản phẩm</h3>
        </div>
        <div className="p-5 space-y-4 text-sm">
          <InfoRow label="Danh mục" value={categoryName} badge />
          <InfoRow label="Thương hiệu" value={brandName} badge color="blue" />
          <InfoRow label="Giá cơ bản" value={basePriceFormatted} bold />
          <InfoRow label="Khoảng giá" value={priceRange} bold color="gray" />
          <InfoRow label="Ngày tạo" value={dayjs(product.createdAt).format('DD/MM/YYYY')} />
          <InfoRow label="Cập nhật" value={dayjs(product.updatedAt).format('HH:mm DD/MM/YYYY')} />
        </div>
      </div>
    </div>
  );
};

const Record = ({ label, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-500",
    emerald: "bg-emerald-50 text-emerald-500",
    orange: "bg-yellow-50 text-orange-400",
    purple: "bg-purple-50 text-purple-500"
  };
  return (
    <div className="p-4 flex gap-4 items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colors[color]}`}>{icon}</div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-xs font-medium text-gray-400 mb-0.5">{label}</div>
        <div className="font-bold text-gray-900 text-base">{value}</div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, badge, color, bold }) => (
  <div className="flex justify-between items-center pb-3 border-b border-gray-50 border-dashed last:border-0 last:pb-0">
    <span className="text-gray-500 font-medium">{label}</span>
    {badge ? (
      <span className={`font-medium px-2.5 py-1 rounded-md ${color === 'blue' ? 'text-blue-600 bg-blue-50' : 'bg-gray-50 text-gray-800'}`}>{value}</span>
    ) : (
      <span className={`font-medium ${bold ? 'font-bold text-gray-900' : 'text-gray-500'}`}>{value}</span>
    )}
  </div>
);

export default ProductSidebar;
