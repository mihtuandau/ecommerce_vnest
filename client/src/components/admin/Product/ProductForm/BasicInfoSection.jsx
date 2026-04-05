import { Form, Input, InputNumber } from 'antd';
import { CARD_CLASS, CONTROL_SIZE } from './formConstants';

const { TextArea } = Input;

export const BasicInfoSection = ({ onNameChange }) => {
  return (
    <>
      <div className={CARD_CLASS + ' p-6'}>
        <div className="flex items-baseline justify-between mb-6">
          <span className="text-base font-semibold text-gray-900">Thông tin cơ bản</span>
          <span className="text-xs text-gray-500">Bắt buộc</span>
        </div>

        <div className="space-y-4">
          <Form.Item
            name="name"
            label={<span className="text-sm font-medium text-gray-700">Tên sản phẩm</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input
              placeholder="Ví dụ: iPhone 15 Pro Max"
              size={CONTROL_SIZE}
              onChange={onNameChange}
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label={<span className="text-sm font-medium text-gray-700">Slug (URL thân thiện)</span>}
            extra={<span className="text-xs text-gray-500">Để trống để tự động tạo từ tên sản phẩm</span>}
          >
            <Input placeholder="iphone-15-pro-max" size={CONTROL_SIZE} className="rounded-lg font-mono text-sm" />
          </Form.Item>

          <Form.Item 
            name="description" 
            label={<span className="text-sm font-medium text-gray-700">Mô tả sản phẩm</span>}
          >
            <TextArea
              rows={5}
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
              className="rounded-lg"
              showCount
              maxLength={2000}
            />
          </Form.Item>
        </div>
      </div>

      <div className={CARD_CLASS + ' p-6'}>
        <div className="flex items-baseline justify-between mb-6">
          <span className="text-base font-semibold text-gray-900">Giá</span>
          <span className="text-xs text-gray-500">Bắt buộc</span>
        </div>

        <Form.Item
          name="basePrice"
          label={<span className="text-sm font-medium text-gray-700">Giá sản phẩm</span>}
          rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
        >
          <InputNumber
            min={0}
            placeholder="0"
            style={{ width: '100%' }}
            size={CONTROL_SIZE}
            className="rounded-lg"
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(v) => (v || '').replace(/\$\s?|(,*)/g, '')}
            addonAfter="₫"
          />
        </Form.Item>
      </div>

      <div className={CARD_CLASS + ' p-6'}>
        <div className="flex items-baseline justify-between mb-6">
          <span className="text-base font-semibold text-gray-900">Tồn kho</span>
          <span className="text-xs text-gray-500">Theo biến thể</span>
        </div>
        <p className="text-sm text-gray-600">
          Stock được quản lý theo từng biến thể trong bảng bên dưới.
        </p>
      </div>
    </>
  );
};

export default BasicInfoSection;
