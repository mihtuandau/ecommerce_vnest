import { Form, Select } from 'antd';
import { CARD_CLASS, CONTROL_SIZE } from './formConstants';

const { Option } = Select;

export const CategoriesSection = ({ categories = [], brands = [] }) => {
  return (
    <div className={CARD_CLASS + ' p-6'}>
      <div className="flex items-baseline justify-between mb-6">
        <span className="text-base font-semibold text-gray-900">Phân loại</span>
        <span className="text-xs text-gray-500">Bắt buộc</span>
      </div>

      <div className="space-y-4">
        <Form.Item
          name="categoryId"
          label={<span className="text-sm font-medium text-gray-700">Danh mục</span>}
          rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
        >
          <Select
            placeholder="Chọn danh mục sản phẩm"
            size={CONTROL_SIZE}
            showSearch
            className="rounded-lg"
            optionFilterProp="children"
          >
            {categories.map((c) => (
              <Option key={c.id} value={c.id}>{c.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="brandId"
          label={<span className="text-sm font-medium text-gray-700">Thương hiệu</span>}
        >
          <Select
            placeholder="Chọn thương hiệu (tùy chọn)"
            size={CONTROL_SIZE}
            allowClear
            showSearch
            className="rounded-lg"
            optionFilterProp="children"
          >
            {brands.map((b) => (
              <Option key={b.id} value={b.id}>{b.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </div>
  );
};

export default CategoriesSection;
