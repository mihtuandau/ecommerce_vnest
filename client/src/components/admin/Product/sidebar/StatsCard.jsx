const StatsCard = ({ product }) => {
  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  const totalVariants = product.variants?.length || 0;
  const totalImages = (product.images?.length || 0) + (product.variants?.reduce((sum, v) => sum + (v.images?.length || 0), 0) || 0);

  const views =
    product.viewCount ?? product.views ?? product.totalViews ?? product.statistics?.views ?? null;
  const sold =
    product.soldCount ?? product.sold ?? product.totalSold ?? product.statistics?.sold ?? null;

  const stats = [
    { label: 'Lượt xem', value: views ?? '—', icon: '👁️', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Đã bán', value: sold ?? '—', icon: '💰', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Tồn kho', value: totalStock, icon: '📦', color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Biến thể', value: totalVariants, icon: '🎨', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Hình ảnh', value: totalImages, icon: '📷', color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-5 text-gray-900">Thống kê nhanh</h3>
      
      <div className="space-y-3">
        {stats.map((stat, idx) => (
          <div key={idx} className={`flex items-center justify-between p-3 ${stat.bg} rounded-lg hover:shadow-sm transition-all border border-gray-200`}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-sm font-medium text-gray-700">{stat.label}</span>
            </div>
            <span className={`font-bold text-lg ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1.5">
          <p className="flex items-center gap-2">
            <span>📅</span>
            <span>Tạo: {new Date(product.createdAt).toLocaleDateString('vi-VN')}</span>
          </p>
          <p className="flex items-center gap-2">
            <span>♻️</span>
            <span>Cập nhật: {new Date(product.updatedAt || product.createdAt).toLocaleDateString('vi-VN')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;