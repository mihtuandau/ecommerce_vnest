import { useState, useEffect, useMemo } from 'react';
import categoryService from '../../../services/categoryService';
import toast from 'react-hot-toast';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import Pagination from '../../../components/common/Pagination';
import { Plus, Edit, Trash2, X, Search, ChevronUp, ChevronDown, FolderOpen, Upload, ImageIcon } from 'lucide-react';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
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
      toast.error('Không thể tải danh mục');} finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) {
        toast.error('Vui lòng nhập tên danh mục');
        return;
      }

      // Create FormData for API
      const data = new FormData();
      data.append('name', formData.name.trim());
      
      // Add image file if selected
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (editingId) {
        await categoryService.update(editingId, data);
        toast.success('Cập nhật danh mục thành công');
      } else {
        await categoryService.create(data);
        toast.success('Tạo danh mục thành công');
      }
      
      setFormData({ name: '', image: null });
      setImagePreview(null);
      setEditingId(null);
      setShowForm(false);
      loadCategories();
    } catch (error) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra';
      toast.error(message);}
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, image: null });
    setImagePreview(category.image || null);
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      
      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa danh mục này?')) {
      try {
        await categoryService.delete(id);
        toast.success('Xóa danh mục thành công');
        loadCategories();
      } catch (error) {
        const message = error.response?.data?.message || 'Không thể xóa danh mục';
        toast.error(message);}
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', image: null });
    setImagePreview(null);
    setEditingId(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              Quản lý Danh mục
            </h1>
            <p className="text-gray-600">
              Quản lý các danh mục sản phẩm trong hệ thống
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            icon={Plus}
            className="hidden md:inline-flex"
          >
            Thêm danh mục
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-white/80 backdrop-blur-sm p-4">
            <p className="text-sm text-gray-600">Tổng danh mục</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{categories.length}</p>
          </div>
          <div className="rounded-xl border bg-white/80 backdrop-blur-sm p-4">
            <p className="text-sm text-gray-600">Đang hiển thị</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{filteredCategories.length}</p>
          </div>
          <div className="rounded-xl border bg-white/80 backdrop-blur-sm p-4">
            <p className="text-sm text-gray-600">Tổng sản phẩm</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {categories.reduce((sum, c) => sum + (c._count?.products || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên danh mục"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh danh mục (tùy chọn)
                </label>
                
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-1 text-sm text-gray-500">
                          <span className="font-semibold">Nhấn để tải ảnh</span> hoặc kéo thả
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  {editingId ? 'Cập nhật' : 'Tạo mới'}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="secondary"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <Button
            onClick={() => setShowForm(true)}
            icon={Plus}
            className="md:hidden"
          >
            Thêm danh mục
          </Button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {loading ? (
          <Loading text="Đang tải dữ liệu..." />
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-gray-400" />
            </div>
            <p className="mt-4 text-gray-700 font-medium">
              {searchQuery ? 'Không tìm thấy danh mục phù hợp' : 'Chưa có danh mục nào'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Thử thay đổi từ khóa tìm kiếm' : 'Nhấn "Thêm danh mục" để tạo mới'}
            </p>
            {!searchQuery && (
              <div className="mt-4">
                <Button icon={Plus} onClick={() => setShowForm(true)}>Thêm danh mục</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="inline-flex items-center gap-1 hover:text-gray-700"
                      onClick={() => toggleSort('name')}
                    >
                      Tên danh mục
                      {sortBy === 'name' && (
                        sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="inline-flex items-center gap-1 hover:text-gray-700"
                      onClick={() => toggleSort('products')}
                    >
                      Số sản phẩm
                      {sortBy === 'products' && (
                        sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedCategories.map((category, idx) => (
                  <tr key={category.id} className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50 transition-colors' : 'bg-gray-50 hover:bg-gray-100 transition-colors'}>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      {category.image ? (
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      {category.description && (
                        <div className="text-xs text-gray-500 mt-0.5">{category.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category._count?.products || 0} sản phẩm
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors inline-flex"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors inline-flex"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            {filteredCategories.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsCount={paginatedCategories.length}
                totalItems={filteredCategories.length}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
