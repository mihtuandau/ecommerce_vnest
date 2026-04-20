import React from 'react';

const ProductOverviewTab = ({ product, totalStock, sold, views, rating, reviewCount }) => {
  return (
    <div className="space-y-8 animate-fade-in text-gray-900">
      <div>
        <h3 className="font-bold text-sm mb-4">Mô tả sản phẩm</h3>
        <div className="bg-[#f8f9fa] rounded-2xl p-5 text-sm leading-relaxed border border-transparent min-h-[80px]">
          {product.description ? (
            <div dangerouslySetInnerHTML={{ __html: product.description }} className="prose prose-sm max-w-none text-gray-600" />
          ) : (
            <div className="text-gray-400 font-medium">Bạn chưa viết mô tả cho sản phẩm.</div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-4">Thông tin nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Tổng tồn kho" value={totalStock.toLocaleString()} subLabel="sản phẩm" />
          <StatCard 
            label="Biến thể hoạt động" 
            value={
              <>
                {product.variants?.filter(v => v.isActive !== false)?.length || 0}
                <span className="text-lg text-gray-400">/{product.variants?.length || 0}</span>
              </>
            } 
            subLabel="biến thể" 
          />
          <StatCard label="Đã bán" value={sold.toLocaleString()} subLabel="lượt" />
          <StatCard label="Lượt xem" value={views.toLocaleString()} subLabel="lượt" />
          <StatCard label="Đánh giá TB" value={Number(rating).toFixed(1)} subLabel="/ 5 sao" />
          <StatCard label="Số đánh giá" value={reviewCount.toLocaleString()} subLabel="lượt" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, subLabel }) => (
  <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-transparent">
    <div className="text-xs font-semibold text-gray-500 mb-1">{label}</div>
    <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
    <div className="text-xs font-medium text-gray-500">{subLabel}</div>
  </div>
);

export default ProductOverviewTab;
