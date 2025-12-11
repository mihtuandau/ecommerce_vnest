const CategoryStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="rounded-xl bg-white shadow-sm p-6">
        <p className="text-sm font-medium text-gray-600">Tổng danh mục</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
      </div>
      <div className="rounded-xl bg-white shadow-sm p-6">
        <p className="text-sm font-medium text-gray-600">Đang hiển thị</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{stats.filtered}</p>
      </div>
      <div className="rounded-xl bg-white shadow-sm p-6">
        <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
      </div>
    </div>
  );
};

export default CategoryStatsCards;
