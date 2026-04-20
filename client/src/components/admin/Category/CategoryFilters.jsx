import { Search, Plus } from 'lucide-react';
import Button from '../../common/Button';

const CategoryFilters = ({ searchQuery, onSearchChange, onAddClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
          />
        </div>
        <Button
          onClick={onAddClick}
          icon={Plus}
          className="sm:hidden"
        >
          Thêm danh mục
        </Button>
      </div>
    </div>
  );
};

export default CategoryFilters;






