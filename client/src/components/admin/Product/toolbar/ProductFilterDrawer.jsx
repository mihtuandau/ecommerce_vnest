import React from 'react';
import { Drawer, Form, Select, Button, InputNumber, Divider, Badge } from 'antd';

const { Option } = Select;

const ProductFilterDrawer = ({ 
  open, 
  setOpen, 
  categories, 
  brands, 
  form, 
  handleApply, 
  handleReset, 
  activeFiltersCount 
}) => {
  return (
    <Drawer
      title={
        <div className="flex items-center justify-between pr-8">
          <span className="text-lg font-medium">Bộ lọc & sắp xếp</span>
          {activeFiltersCount > 0 && <Badge count={activeFiltersCount} color="#1890ff" />}
        </div>
      }
      open={open}
      onClose={() => setOpen(false)}
      width={420}
      destroyOnClose
      footer={
        <div className="flex justify-end gap-3">
          <Button onClick={handleReset}>Đặt lại</Button>
          <Button type="primary" onClick={handleApply}>Áp dụng</Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item label="Danh mục" name="categoryId">
          <Select placeholder="Chọn danh mục" allowClear showSearch optionFilterProp="children">
            {categories.map(cat => <Option key={cat.id} value={cat.id}>{cat.name}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item label="Thương hiệu" name="brandId">
          <Select placeholder="Chọn thương hiệu" allowClear showSearch optionFilterProp="children">
            {brands.map(b => <Option key={b.id} value={b.id}>{b.name}</Option>)}
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
                  return Number(value) <= Number(max) ? Promise.resolve() : Promise.reject('Giá từ phải nhỏ hơn hoặc bằng giá đến');
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
      </Form>
    </Drawer>
  );
};

export default ProductFilterDrawer;
