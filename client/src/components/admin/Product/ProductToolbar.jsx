import { useMemo, useState } from 'react';
import { Input, Select, Button, Space, Badge, Tag, Tooltip, Form } from 'antd';
import { SearchOutlined, FilterOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import ProductFilterDrawer from './toolbar/ProductFilterDrawer';

const { Option } = Select;

const ProductToolbar = ({
  search, setSearch, selectedCategory, setSelectedCategory, categories, 
  selectedBrand, setSelectedBrand, brands = [], status, setStatus,
  minPrice, maxPrice, setPriceRange, sortBy, setSort, onResetFilters,
  selectedProducts, onBulkDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const activeFilters = useMemo(() => {
    const filters = [];
    if (search) filters.push({ key: 'search', label: `Tìm: ${search}`, onClose: () => setSearch('') });
    if (selectedCategory) {
      const cat = categories.find(c => c.id === selectedCategory);
      filters.push({ key: 'category', label: `Danh mục: ${cat?.name || selectedCategory}`, onClose: () => setSelectedCategory('') });
    }
    if (selectedBrand) {
      const brand = brands.find(b => b.id === selectedBrand);
      filters.push({ key: 'brand', label: `Thương hiệu: ${brand?.name || selectedBrand}`, onClose: () => setSelectedBrand('') });
    }
    if (status) {
      const statusMap = { active: 'Đang bán', inactive: 'Ngừng bán', draft: 'Nháp' };
      filters.push({ key: 'status', label: `Trạng thái: ${statusMap[status] || status}`, onClose: () => setStatus('') });
    }
    if (minPrice || maxPrice) {
      filters.push({ key: 'price', label: `Giá: ${minPrice || '0'} – ${maxPrice || '∞'}`, onClose: () => setPriceRange({ minPrice: '', maxPrice: '' }) });
    }
    if (sortBy && sortBy !== 'newest') {
      const sortMap = { oldest: 'Cũ nhất', 'price-asc': 'Giá ↑', 'price-desc': 'Giá ↓', 'name-asc': 'A-Z', 'name-desc': 'Z-A', sold: 'Bán chạy', rating: 'Đánh giá' };
      filters.push({ key: 'sort', label: `Sắp xếp: ${sortMap[sortBy] || sortBy}`, onClose: () => setSort({ sortBy: 'newest' }) });
    }
    return filters;
  }, [search, selectedCategory, selectedBrand, status, minPrice, maxPrice, sortBy, categories, brands]);

  const handleApply = async () => {
    try {
      const v = await form.validateFields();
      setSelectedCategory(v.categoryId ?? ''); setSelectedBrand(v.brandId ?? ''); setStatus(v.status ?? '');
      setPriceRange({ minPrice: v.minPrice?.toString() ?? '', maxPrice: v.maxPrice?.toString() ?? '' });
      setSort({ sortBy: v.sortBy ?? 'newest' }); setOpen(false);
    } catch {}
  };

  const openFilter = () => {
    form.setFieldsValue({
      categoryId: selectedCategory || undefined, brandId: selectedBrand || undefined,
      status: status || undefined, minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined, sortBy: sortBy || 'newest',
    });
    setOpen(true);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Input
          placeholder="Tìm theo tên, SKU, mã sản phẩm..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search} onChange={e => setSearch(e.target.value)} allowClear
          className="max-w-full sm:max-w-xs" size="large"
        />

        <Space wrap size="middle" className="flex-1 justify-end">
          <Select value={selectedCategory || undefined} onChange={v => setSelectedCategory(v ?? '')} placeholder="Danh mục" allowClear className="w-36 min-w-[140px]" size="large">
            <Option value="">Tất cả danh mục</Option>
            {categories.map(cat => <Option key={cat.id} value={cat.id}>{cat.name}</Option>)}
          </Select>

          <Select value={selectedBrand || undefined} onChange={v => setSelectedBrand(v ?? '')} placeholder="Thương hiệu" allowClear className="w-36 min-w-[140px]" size="large">
            <Option value="">Tất cả</Option>
            {brands.map(b => <Option key={b.id} value={b.id}>{b.name}</Option>)}
          </Select>

          <Tooltip title="Bộ lọc & sắp xếp nâng cao">
            <Badge count={activeFilters.length} size="small" offset={[8, 0]}>
              <Button type="default" icon={<FilterOutlined />} size="large" onClick={openFilter} className="border-gray-300">Lọc</Button>
            </Badge>
          </Tooltip>
        </Space>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {activeFilters.map(f => (
            <Tag key={f.key} closable onClose={f.onClose} className="px-3 py-1 text-sm bg-blue-50 border-blue-200 text-blue-700 rounded-full" closeIcon={<CloseOutlined className="text-xs" />}>
              {f.label}
            </Tag>
          ))}
          <Button type="link" size="small" onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedBrand(''); setStatus(''); setPriceRange({ minPrice: '', maxPrice: '' }); setSort({ sortBy: 'newest' }); onResetFilters?.(); }} className="text-gray-500 hover:text-red-500">Xóa tất cả</Button>
        </div>
      )}

      {selectedProducts.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between gap-3 flex-wrap">
          <span className="font-medium text-blue-800">Đã chọn <strong>{selectedProducts.length}</strong> sản phẩm</span>
          <Button danger type="primary" icon={<DeleteOutlined />} onClick={onBulkDelete} size="middle">Xóa đã chọn</Button>
        </div>
      )}

      <ProductFilterDrawer 
        open={open} setOpen={setOpen} categories={categories} brands={brands} 
        form={form} handleApply={handleApply} handleReset={() => { form.resetFields(); onResetFilters?.(); setOpen(false); }} 
        activeFiltersCount={activeFilters.length} 
      />
    </div>
  );
};

export default ProductToolbar;
