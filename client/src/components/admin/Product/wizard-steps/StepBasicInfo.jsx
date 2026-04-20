import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import RichTextEditor from '../RichTextEditor';

const { Option } = Select;

const StepBasicInfo = ({ form, categories, brands, onNameChange }) => {
  return (
    <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 lg:p-6">
      <Form.Item
        name="name"
        label={<span className="text-sm font-semibold text-gray-700">Tên sản phẩm <span className="text-red-500">*</span></span>}
        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
      >
        <Input 
          placeholder="VD: Nike Air Max 270" 
          size="large" 
          onChange={(e) => {
            form.setFieldValue('name', e.target.value);
            if (onNameChange) onNameChange(e);
          }} 
          className="rounded-lg" 
        />
      </Form.Item>

      <Form.Item
        name="slug"
        label={<span className="text-sm font-semibold text-gray-700">Đường dẫn (Slug)</span>}
        extra={<span className="text-[11px] text-gray-500 block mt-1">URL sẽ là: yourshop.com/products/duong-dan-san-pham</span>}
      >
        <Input addonBefore="/products/" placeholder="duong-dan-san-pham" size="large" className="rounded-lg" />
      </Form.Item>

      <Form.Item 
        name="description" 
        label={<span className="text-sm font-semibold text-gray-700">Mô tả sản phẩm</span>}
        className="mb-0"
      >
        <RichTextEditor
          placeholder="Mô tả chi tiết về sản phẩm..."
          onChange={(html) => form.setFieldValue('description', html)}
        />
      </Form.Item>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">$</div>
          <div>
            <h3 className="font-bold text-gray-900">Giá & Phân loại</h3>
            <p className="text-xs text-gray-500">Thiết lập giá cơ bản và danh mục sản phẩm</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="basePrice"
            label={<span className="text-sm font-semibold text-gray-700">Giá cơ bản <span className="text-red-500">*</span></span>}
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
            className="mb-0"
          >
            <InputNumber
              min={0}
              placeholder="0"
              style={{ width: '100%' }}
              size="large"
              className="rounded-lg"
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(v) => (v || '').replace(/\$\s?|(,*)/g, '')}
              addonAfter="VNĐ"
            />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label={<span className="text-sm font-semibold text-gray-700">Danh mục <span className="text-red-500">*</span></span>}
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
            className="mb-0"
          >
            <Select placeholder="-- Chọn danh mục --" size="large" className="rounded-lg" showSearch optionFilterProp="children">
              {categories.map((c) => (
                <Option key={c.id} value={c.id}>{c.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item 
          name="brandId" 
          label={<span className="text-sm font-semibold text-gray-700">Thương hiệu</span>}
          className="mt-6 mb-0"
        >
          <Select placeholder="-- Không có thương hiệu --" size="large" className="rounded-lg" allowClear showSearch optionFilterProp="children">
            {brands.map((b) => (
              <Option key={b.id} value={b.id}>{b.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </div>
  );
};

export default StepBasicInfo;
