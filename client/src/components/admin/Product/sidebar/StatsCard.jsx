const StatsCard = ({ product }) => {
  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  const totalVariants = product.variants?.length || 0;
  const totalImages = (product.images?.length || 0) + (product.variants?.reduce((sum, v) => sum + (v.images?.length || 0), 0) || 0);

  const stats = [
    { label: 'Lượt xem', value: '1,234', icon: '👁️', color: 'text-blue-600' },
    { label: 'Đã bán', value: '45 SP', icon: '💰', color: 'text-emerald-600' },
    { label: 'Tồn kho', value: totalStock, icon: '📦', color: 'text-amber-600' },
    { label: 'Biến thể', value: totalVariants, icon: '🎨', color: 'text-purple-600' },
    { label: 'Hình ảnh', value: totalImages, icon: '📷', color: 'text-pink-600' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold mb-4 text-gray-900">Thống kê nhanh</h3>
      
      <div className="space-y-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
            <span className={`font-bold text-lg ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p>📅 Tạo: {new Date(product.createdAt).toLocaleDateString('vi-VN')}</p>
          <p>♻️ Cập nhật: {new Date(product.updatedAt || product.createdAt).toLocaleDateString('vi-VN')}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
