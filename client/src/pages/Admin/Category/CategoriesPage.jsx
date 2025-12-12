import { useState, useEffect, useMemo } from 'react';
import categoryService from '../../../services/categoryService';
import { notify } from '../../../utils/notification';
import Button from '../../../components/common/Button';
import Pagination from '../../../components/common/Pagination';
import CategoryStatsCards from '../../../components/admin/Category/CategoryStatsCards';
import CategoryFilters from '../../../components/admin/Category/CategoryFilters';
import CategoryFormModal from '../../../components/admin/Category/CategoryFormModal';
import CategoryTable from '../../../components/admin/Category/CategoryTable';
import { Plus } from 'lucide-react';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      notify.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
        notify.success('Cập nhật danh mục thành công');
      } else {
        await categoryService.create(formData);
        notify.success('Tạo danh mục thành công');
      }
      
      setEditingCategory(null);
      setShowForm(false);
      loadCategories();
    } catch (error) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra';
      notify.error(message);
      throw error;
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa danh mục này?')) {
      try {
        await categoryService.delete(id);
        notify.success('Xóa danh mục thành công');
        loadCategories();
      } catch (error) {
        const message = error.response?.data?.message || 'Không thể xóa danh mục';
        notify.error(message);
      }
    }
  };

  const handleCloseForm = () => {
    setEditingCategory(null);
    setShowForm(false);
  };

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const filteredCategories = useMemo(() => {
    let filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    filtered.sort((a, b) => {
      const getVal = (c) => {
        if (sortBy === 'products') return c._count?.products || 0;
        return (c.name || '').toLowerCase();
      };
      const va = getVal(a);
      const vb = getVal(b);
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }, [categories, searchQuery, sortBy, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage));
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, sortDir]);

  const stats = useMemo(() => ({
    total: categories.length,
    filtered: filteredCategories.length,
    totalProducts: categories.reduce((sum, c) => sum + (c._count?.products || 0), 0),
  }), [categories, filteredCategories]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Danh mục</h1>
          <p className="text-gray-600 mt-1">Quản lý các danh mục sản phẩm trong hệ thống</p>
        </div>
        <Button onClick={() => setShowForm(true)} icon={Plus}>
          Thêm danh mục
        </Button>
      </div>

      {/* Stats */}
      <CategoryStatsCards stats={stats} />

      {/* Filters */}
      <CategoryFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setShowForm(true)}
      />

      {/* Table */}
      <div>
        <CategoryTable
          categories={paginatedCategories}
          loading={loading}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={toggleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />

        {!loading && filteredCategories.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsCount={paginatedCategories.length}
            totalItems={filteredCategories.length}
          />
        )}
      </div>

      {/* Form Modal */}
      <CategoryFormModal
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        category={editingCategory}
      />
    </div>
  );
};

export default AdminCategoriesPage;

