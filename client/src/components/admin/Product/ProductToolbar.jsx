import { useMemo, useState } from 'react';
import {
  Input,
  Select,
  Button,
  Space,
  Badge,
  Drawer,
  Form,
  InputNumber,
  Tag,
  Divider,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DeleteOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const ACCENT_BADGE_COLOR = '#37A76B';
const ACTIVE_FILTER_TAG_CLASS = 'px-3 py-1 text-sm bg-[#F3FBF6] border-[#CDEBD9] text-[#2E7D55] rounded-full';
const BULK_SELECTED_CLASS = 'mt-4 p-3 bg-[#F3FBF6] border border-[#CDEBD9] rounded-lg flex items-center justify-between gap-3 flex-wrap';

const { Option } = Select;

const ProductToolbar = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedBrand,
  setSelectedBrand,
  brands = [],
  status,
  setStatus,
  minPrice,
  maxPrice,
  setPriceRange,
  sortBy,
  setSort,
  onResetFilters,
  selectedProducts,
  onBulkDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const activeFilters = useMemo(() => {
    const filters = [];

    if (search) {
      filters.push({
        key: 'search',
        label: `Tìm: ${search}`,
        value: search,
        onClose: () => setSearch(''),
      });
    }
    if (selectedCategory) {
      const cat = categories.find(c => c.id === selectedCategory);
      filters.push({
        key: 'category',
        label: `Danh mục: ${cat?.name || selectedCategory}`,
        value: selectedCategory,
        onClose: () => setSelectedCategory(''),
      });
    }
    if (selectedBrand) {
      const brand = brands.find(b => b.id === selectedBrand);
      filters.push({
        key: 'brand',
        label: `Thương hiệu: ${brand?.name || selectedBrand}`,
        value: selectedBrand,
        onClose: () => setSelectedBrand(''),
      });
    }
    if (status) {
      const statusMap = {
        active: 'Đang bán',
        inactive: 'Ngừng bán',
        draft: 'Nháp',
      };
      filters.push({
        key: 'status',
        label: `Trạng thái: ${statusMap[status] || status}`,
        value: status,
        onClose: () => setStatus(''),
      });
    }
    if (minPrice || maxPrice) {
      const label = `Giá: ${minPrice ? minPrice : '0'} ${maxPrice ? `– ${maxPrice}` : '+'}`;
      filters.push({
        key: 'price',
        label,
        value: 'price',
        onClose: () => setPriceRange({ minPrice: '', maxPrice: '' }),
      });
    }
    if (sortBy && sortBy !== 'newest') {
      const sortMap = {
        oldest: 'Cũ nhất',
        'price-asc': 'Giá tăng dần',
        'price-desc': 'Giá giảm dần',
        'name-asc': 'Tên A → Z',
        'name-desc': 'Tên Z → A',
        sold: 'Bán chạy',
        rating: 'Đánh giá cao',
      };
      filters.push({
        key: 'sort',
        label: `Sắp xếp: ${sortMap[sortBy] || sortBy}`,
        value: sortBy,
        onClose: () => setSort({ sortBy: 'newest' }),
      });
    }

    return filters;
  }, [
    search,
    selectedCategory,
    selectedBrand,
    status,
    minPrice,
    maxPrice,
    sortBy,
    categories,
    brands,
  ]);

  const openDrawer = () => {
    form.setFieldsValue({
      categoryId: selectedCategory || undefined,
      brandId: selectedBrand || undefined,
      status: status || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy: sortBy || 'newest',
    });
    setOpen(true);
  };

  const handleApply = async () => {
    try {
      const values = await form.validateFields();
      setSelectedCategory(values.categoryId ?? '');
      setSelectedBrand(values.brandId ?? '');
      setStatus(values.status ?? '');
      setPriceRange({
        minPrice: values.minPrice?.toString() ?? '',
        maxPrice: values.maxPrice?.toString() ?? '',
      });
      setSort({ sortBy: values.sortBy ?? 'newest' });
      setOpen(false);
    } catch {}
  };

  const handleReset = () => {
    form.resetFields();
    onResetFilters?.();
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-4">
      {/* Main toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Input
          placeholder="Tìm theo tên, SKU, mã sản phẩm..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          allowClear
          className="max-w-full sm:max-w-xs"
          size="large"
        />

        <Space wrap size="middle" className="flex-1 justify-end">
          <Select
            value={selectedCategory || undefined}
            onChange={v => setSelectedCategory(v ?? '')}
            placeholder="Danh mục"
            allowClear
            className="w-36 min-w-[140px]"
            size="large"
          >
            <Option value="">Tất cả danh mục</Option>
            {categories.map(cat => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>

          <Select
            value={selectedBrand || undefined}
            onChange={v => setSelectedBrand(v ?? '')}
            placeholder="Thương hiệu"
            allowClear
            className="w-36 min-w-[140px]"
            size="large"
          >
            <Option value="">Tất cả</Option>
            {brands.map(b => (
              <Option key={b.id} value={b.id}>
                {b.name}
              </Option>
            ))}
          </Select>

          <Select
            value={status || undefined}
            onChange={v => setStatus(v ?? '')}
            placeholder="Trạng thái"
            allowClear
            className="w-32 min-w-[120px]"
            size="large"
          >
            <Option value="">Tất cả</Option>
            <Option value="active">Đang bán</Option>
            <Option value="inactive">Ngừng bán</Option>
            <Option value="draft">Nháp</Option>
          </Select>

          <Tooltip title="Bộ lọc & sắp xếp nâng cao">
            <Badge count={activeFilters.length} size="small" offset={[8, 0]}>
              <Button
                type="default"
                icon={<FilterOutlined />}
                size="large"
                onClick={openDrawer}
                className="border-gray-300"
              >
                Lọc
              </Button>
            </Badge>
          </Tooltip>
        </Space>
      </div>

      {/* Active filters chips */}
      {activeFilters.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {activeFilters.map(f => (
            <Tag
              key={f.key}
              closable
              onClose={f.onClose}
              className={ACTIVE_FILTER_TAG_CLASS}
              closeIcon={<CloseOutlined className="text-xs" />}
            >
              {f.label}
            </Tag>
          ))}
          <Button
            type="link"
            size="small"
            onClick={() => {
              setSearch('');
              setSelectedCategory('');
              setSelectedBrand('');
              setStatus('');
              setPriceRange({ minPrice: '', maxPrice: '' });
              setSort({ sortBy: 'newest' });
              onResetFilters?.();
            }}
            className="text-gray-500 hover:text-red-500"
          >
            Xóa tất cả
          </Button>
        </div>
      )}

      {/* Selected products bulk action */}
      {selectedProducts.length > 0 && (
        <div className={BULK_SELECTED_CLASS}>
          <span className="font-medium text-[#2E7D55]">
            Đã chọn <strong>{selectedProducts.length}</strong> sản phẩm
          </span>
          <Button
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={onBulkDelete}
            size="middle"
          >
            Xóa đã chọn
          </Button>
        </div>
      )}

      {/* Drawer */}
      <Drawer
        title={
          <div className="flex items-center justify-between pr-8">
            <span className="text-lg font-medium">Bộ lọc & sắp xếp</span>
            {activeFilters.length > 0 && (
              <Badge count={activeFilters.length} color={ACCENT_BADGE_COLOR} />
            )}
          </div>
        }
        open={open}
        onClose={() => setOpen(false)}
        size="large"
        width={420}
        destroyOnClose
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={handleReset}>Đặt lại</Button>
            <Button type="primary" onClick={handleApply}>
              Áp dụng
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="Danh mục" name="categoryId">
            <Select placeholder="Chọn danh mục" allowClear showSearch optionFilterProp="children">
              {categories.map(cat => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Thương hiệu" name="brandId">
            <Select placeholder="Chọn thương hiệu" allowClear showSearch optionFilterProp="children">
              {brands.map(b => (
                <Option key={b.id} value={b.id}>
                  {b.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Trạng thái" name="status">
            <Select placeholder="Chọn trạng thái" allowClear>
              <Option value="active">Đang bán</Option>
              <Option value="inactive">Ngừng bán</Option>
              <Option value="draft">Nháp</Option>
            </Select>
          </Form.Item>

          <Divider className="my-5" />

          <div className="flex gap-4">
            <Form.Item
              label="Giá từ"
              name="minPrice"
              style={{ flex: 1 }}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const max = getFieldValue('maxPrice');
                    if (!value || !max) return Promise.resolve();
                    return Number(value) <= Number(max)
                      ? Promise.resolve()
                      : Promise.reject('Giá từ phải nhỏ hơn hoặc bằng giá đến');
                  },
                }),
              ]}
            >
              <InputNumber
                min={0}
                placeholder="0"
                style={{ width: '100%' }}
                formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={val => val?.replace(/\,\s?/g, '')}
              />
            </Form.Item>

            <Form.Item label="Giá đến" name="maxPrice" style={{ flex: 1 }}>
              <InputNumber
                min={0}
                placeholder="∞"
                style={{ width: '100%' }}
                formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={val => val?.replace(/\,\s?/g, '')}
              />
            </Form.Item>
          </div>

          <Divider className="my-5" />

          <Form.Item label="Sắp xếp theo" name="sortBy">
            <Select>
              <Option value="newest">Mới nhất</Option>
              <Option value="oldest">Cũ nhất</Option>
              <Option value="price-asc">Giá: thấp → cao</Option>
              <Option value="price-desc">Giá: cao → thấp</Option>
              <Option value="name-asc">Tên: A → Z</Option>
              <Option value="name-desc">Tên: Z → A</Option>
              <Option value="sold">Bán chạy nhất</Option>
              <Option value="rating">Đánh giá cao nhất</Option>
            </Select>
          </Form.Item>

          <div className="mt-6 text-xs text-gray-500 italic">
            Lưu ý: Một số bộ lọc/sắp xếp có thể chưa được backend hỗ trợ → sẽ được bỏ qua.
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default ProductToolbar;