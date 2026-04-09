import { Search, Filter } from 'lucide-react';

const DiscountFilters = ({ search, setSearch, statusFilter, setStatusFilter }) => {
  return (
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hoặc mô tả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-gray-900 focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="expired">Đã hết hạn</option>
              <option value="upcoming">Sắp diễn ra</option>
            </select>
          </div>
        </div>
      </div>
  );
};

export default DiscountFilters;
