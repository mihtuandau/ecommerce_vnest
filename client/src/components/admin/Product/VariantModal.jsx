import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Button, Divider, Tooltip } from 'antd';
import { RefreshCw } from 'lucide-react';

const COMMON_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL',
  '36', '37', '38', '39', '40', '41', '42', '43',
  '256GB', '512GB', '1TB',
  '50ml', '100ml', '200ml'
];

const COMMON_COLORS = [
  { name: 'Đen', color: '#000000' },
  { name: 'Trắng', color: '#ffffff' },
  { name: 'Đỏ', color: '#ef4444' },
  { name: 'Xanh lam', color: '#3b82f6' },
  { name: 'Xanh lục', color: '#10b981' },
  { name: 'Cam', color: '#f97316' },
  { name: 'Tím', color: '#8b5cf6' },
  { name: 'Hồng', color: '#ec4899' },
  { name: 'Xám', color: '#6b7280' },
  { name: 'Nâu', color: '#92400e' },
  { name: 'Be', color: '#d2b48c' },
  { name: 'Bạc', color: '#cbd5e1' }
];

const VariantModal = ({ isOpen, onClose, onSave, editingVariant = null, basePrice = 0 }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      if (editingVariant) {
        form.setFieldsValue({
          size: editingVariant.size || '',
          color: editingVariant.color || '',
          price: editingVariant.price || basePrice || 0,
          stock: editingVariant.stock || 0,
          sku: editingVariant.sku || '',
          lowStockThreshold: editingVariant.lowStockThreshold || 5,
          isActive: editingVariant.isActive !== false,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          price: basePrice || 0,
          stock: 0,
          lowStockThreshold: 5,
          isActive: true
        });
      }
    }
  }, [isOpen, editingVariant, basePrice, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
      onClose();
    } catch (error) {
      console.log('Validation Failed:', error);
    }
  };

  const generateSKU = () => {
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const sizePart = form.getFieldValue('size') ? `-${form.getFieldValue('size').substring(0, 3).toUpperCase()}` : '';
    const colorPart = form.getFieldValue('color') ? `-${form.getFieldValue('color').substring(0, 3).toUpperCase()}` : '';
    form.setFieldsValue({ sku: `SKU-${randomStr}${sizePart}${colorPart}` });
  };

  // Xem giá định dạng
  const priceValue = Form.useWatch('price', form);

  return (
    <Modal
      title={
        <div>
          <h2 className="text-xl font-bold text-gray-900 m-0">{editingVariant ? 'Sửa biến thể' : 'Thêm biến thể mới'}</h2>
          <p className="text-sm font-normal text-gray-500 m-0 mt-1">Điền thông tin chi tiết về biến thể</p>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={handleSave}
      okText={editingVariant ? "Cập nhật" : "Thêm biến thể"}
      cancelText="Hủy"
      width={700}
      centered
      className="variant-custom-modal"
      okButtonProps={{ className: 'bg-blue-600 hover:bg-blue-700 h-10 px-6 rounded-lg shadow-sm font-medium border-0' }}
      cancelButtonProps={{ className: 'h-10 px-6 rounded-lg font-medium' }}
      closeIcon={<span className="text-gray-400 hover:text-gray-600 transition-colors text-xl">✕</span>}
    >
      <Form form={form} layout="vertical" className="mt-6">
        
        <div className="mb-6 text-sm font-bold text-gray-400 tracking-wider uppercase">Phân loại</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <Form.Item name="size" label={<span className="text-sm font-medium text-gray-700">Size / Dung lượng</span>}>
            <Input size="large" placeholder="VD: M, L, 40, 256GB..." className="rounded-xl border-gray-200" />
          </Form.Item>
          
          <Form.Item name="color" label={<span className="text-sm font-medium text-gray-700">Màu sắc</span>}>
            <Input size="large" placeholder="VD: Đen, Trắng, Đỏ..." className="rounded-xl border-gray-200" />
          </Form.Item>
          
          <div className="md:col-span-1 -mt-2 mb-4">
            <div className="flex flex-wrap gap-2">
              {COMMON_SIZES.map(s => (
                <div 
                  key={s} 
                  onClick={() => form.setFieldsValue({ size: s })}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 cursor-pointer hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all bg-white shadow-sm"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-1 -mt-2 mb-4">
            <div className="flex flex-wrap gap-2 items-center">
              {COMMON_COLORS.map(c => (
                <Tooltip key={c.name} title={c.name} arrow={false}>
                  <div
                    onClick={() => form.setFieldsValue({ color: c.name })}
                    className="w-8 h-8 rounded-full cursor-pointer shadow-sm border-2 border-transparent hover:scale-110 transition-transform flex items-center justify-center ring-1 ring-gray-200/50"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.color === '#ffffff' && <div className="w-full h-full rounded-full border border-gray-200"></div>}
                  </div>
                </Tooltip>
              ))}
              <div 
                className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 bg-gradient-to-tr from-pink-400 via-blue-400 to-yellow-400 relative overflow-hidden group"
                onClick={() => document.getElementById('variant-color-picker').click()}
              >
                 <div className="absolute inset-0 bg-white/40 group-hover:bg-white/0 transition-colors"></div>
                 <input type="color" id="variant-color-picker" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onChange={(e) => form.setFieldsValue({ color: `Màu tùy chỉnh (${e.target.value})`})} />
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-2" />

        <div className="my-6 text-sm font-bold text-gray-400 tracking-wider uppercase">Giá & Tồn kho</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <Form.Item name="price" label={<span className="text-sm font-medium text-gray-700">Giá bán <span className="text-red-500">*</span></span>} rules={[{ required: true }]} className="mb-1">
              <InputNumber 
                size="large" 
                min={0} 
                addonAfter="VNĐ" 
                className="w-full rounded-xl variant-price-input" 
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
            <div className="text-xs text-blue-600 font-medium pl-1">
              {priceValue ? `${priceValue.toLocaleString()} ₫` : '0 ₫'}
            </div>
          </div>
          
          <Form.Item name="stock" label={<span className="text-sm font-medium text-gray-700">Số lượng tồn kho <span className="text-red-500">*</span></span>} rules={[{ required: true }]} className="mb-0">
            <InputNumber size="large" min={0} className="w-full rounded-xl" />
          </Form.Item>

          <Form.Item name="sku" label={<span className="text-sm font-medium text-gray-700">SKU</span>} extra={<span className="text-xs text-gray-400">Để trống nếu không có SKU</span>} className="mb-0">
            <div className="flex gap-2">
              <Input size="large" placeholder="VD: NK-AM270-38-BLK" className="rounded-xl border-gray-200 font-mono text-sm leading-6" />
              <Button size="large" icon={<RefreshCw size={16} className="text-gray-500"/>} onClick={generateSKU} className="rounded-xl flex-shrink-0" />
            </div>
          </Form.Item>

          <Form.Item name="lowStockThreshold" label={<span className="text-sm font-medium text-gray-700">Ngưỡng cảnh báo hết hàng</span>} extra={<span className="text-xs text-gray-400">Cảnh báo khi tồn kho ≤ giá trị này</span>} className="mb-0">
            <InputNumber size="large" min={0} className="w-full rounded-xl" />
          </Form.Item>
        </div>

        <div className="mt-8 bg-gray-50/80 rounded-2xl p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="font-semibold text-gray-900">Hiển thị biến thể</div>
            <div className="text-xs text-gray-500 mt-0.5">Biến thể ẩn sẽ không xuất hiện cho khách hàng</div>
          </div>
          <Form.Item name="isActive" valuePropName="checked" className="m-0">
            <Switch className="bg-gray-300" />
          </Form.Item>
        </div>
      </Form>
      <style dangerouslySetInnerHTML={{__html: `
        .variant-custom-modal .ant-modal-content {
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 20px 60px -15px rgba(0,0,0,0.1);
        }
        .variant-custom-modal .ant-modal-header {
          margin-bottom: 0;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
        }
        .variant-custom-modal .ant-modal-title {
          line-height: 1.2;
        }
        .variant-custom-modal .ant-modal-footer {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
        }
        .variant-price-input .ant-input-number-group-addon {
          background-color: transparent;
          color: #6b7280;
          border-color: #e5e7eb;
          border-left: 0;
          border-start-end-radius: 12px;
          border-end-end-radius: 12px;
        }
        .variant-price-input .ant-input-number-input {
          border-start-start-radius: 12px;
          border-end-start-radius: 12px;
        }
      `}} />
    </Modal>
  );
};

export default VariantModal;
