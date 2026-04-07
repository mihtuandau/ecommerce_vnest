import { Card, Form, Input, InputNumber, Select } from 'antd';
import { DollarOutlined, PercentageOutlined, TagsOutlined, ShoppingCartOutlined } from '@ant-design/icons';

/**
 * Component để chọn loại discount và nhập giá trị
 * 4 loại:
 * 1. Fixed Price - Giá cố định
 * 2. Percentage - % chiết khấu
 * 3. Seasonal/Holiday - Có ngày bắt đầu/kết thúc
 * 4. Volume/Bulk - Theo số lượng
 */
const DiscountTypeSelector = ({ form, prefix = 'discount' }) => {
  const discountType = Form.useWatch(`${prefix}Type`, form);

  const typeOptions = [
    { value: 'fixed', label: 'Giá cố định' },
    { value: 'percentage', label: 'Chiết khấu %' },
    { value: 'seasonal', label: 'Khuyến mãi theo mùa' },
    { value: 'volume', label: 'Chiết khấu theo lượng' },
  ];

  const discountTypeCards = [
    {
      type: 'fixed',
      label: 'Giá cố định',
      description: 'Bán với giá cố định',
      icon: <DollarOutlined className="text-2xl" />,
      color: 'blue',
    },
    {
      type: 'percentage',
      label: 'Chiết khấu %',
      description: 'Giảm giá theo phần trăm',
      icon: <PercentageOutlined className="text-2xl" />,
      color: 'green',
    },
    {
      type: 'seasonal',
      label: 'Khuyến mãi mùa',
      description: 'Theo dip/mùa nhất định',
      icon: <TagsOutlined className="text-2xl" />,
      color: 'orange',
    },
    {
      type: 'volume',
      label: 'Chiết khấu theo lượng',
      description: 'Mua nhiều giá rẻ hơn',
      icon: <ShoppingCartOutlined className="text-2xl" />,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Chọn loại discount */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Loại chiết khấu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {discountTypeCards.map((card) => (
            <div
              key={card.type}
              onClick={() => {
                form.setFieldValue(`${prefix}Type`, card.type);
              }}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${
                  discountType === card.type
                    ? `border-${card.color}-500 bg-${card.color}-50`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              <div className={`text-${card.color}-600 mb-2`}>{card.icon}</div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{card.label}</h4>
              <p className="text-xs text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cấu hình chi tiết theo loại discount */}
      {discountType === 'fixed' && (
        <Card 
          title="Giá cố định"
          className="border-blue-200 shadow-sm"
          headStyle={{ borderBottom: '2px solid #1890ff' }}
        >
          <Form.Item
            name={`${prefix}FixedPrice`}
            label="Giá bán"
            rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}
          >
            <InputNumber
              min={0}
              placeholder="Nhập giá bán"
              size="large"
              className="w-full rounded-lg"
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(v) => (v || '').replace(/\$\s?|(,*)/g, '')}
              addonAfter="₫"
            />
          </Form.Item>
        </Card>
      )}

      {discountType === 'percentage' && (
        <Card 
          title="Chiết khấu theo %"
          className="border-green-200 shadow-sm"
          headStyle={{ borderBottom: '2px solid #52c41a' }}
        >
          <Form.Item
            name={`${prefix}Percentage`}
            label="Phần trăm giảm"
            rules={[
              { required: true, message: 'Vui lòng nhập phần trăm' },
              { type: 'number', min: 0, max: 100, message: 'Nhập từ 0-100%' },
            ]}
          >
            <InputNumber
              min={0}
              max={100}
              placeholder="Ví dụ: 20"
              size="large"
              className="w-full rounded-lg"
              suffix="%"
            />
          </Form.Item>
        </Card>
      )}

      {discountType === 'seasonal' && (
        <Card 
          title="Khuyến mãi theo mùa/dip"
          className="border-orange-200 shadow-sm"
          headStyle={{ borderBottom: '2px solid #fa8c16' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Form.Item
              name={`${prefix}SeasonStart`}
              label="Ngày bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <Input type="date" size="large" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name={`${prefix}SeasonEnd`}
              label="Ngày kết thúc"
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <Input type="date" size="large" className="rounded-lg" />
            </Form.Item>
          </div>
          <Form.Item
            name={`${prefix}SeasonDiscount`}
            label="Chiết khấu (%)"
            rules={[{ required: true, message: 'Vui lòng nhập chiết khấu' }]}
          >
            <InputNumber
              min={0}
              max={100}
              placeholder="Ví dụ: 30"
              size="large"
              className="w-full rounded-lg"
              suffix="%"
            />
          </Form.Item>
        </Card>
      )}

      {discountType === 'volume' && (
        <Card 
          title="Chiết khấu theo lượng"
          className="border-purple-200 shadow-sm"
          headStyle={{ borderBottom: '2px solid #722ed1' }}
        >
          <div className="bg-purple-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-700">
              💡 Thiết lập mức giảm giá dựa trên số lượng mua. Ví dụ: Mua 10+ được giảm 10%, mua 20+ được giảm 15%
            </p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Form.Item
                name={`${prefix}VolumeMinQty1`}
                label="Số lượng từ"
                rules={[{ required: true, message: 'Nhập số lượng tối thiểu' }]}
              >
                <InputNumber
                  min={1}
                  placeholder="Ví dụ: 10"
                  size="large"
                  className="w-full rounded-lg"
                />
              </Form.Item>
              <Form.Item
                name={`${prefix}VolumeDiscount1`}
                label="Giảm %"
                rules={[{ required: true, message: 'Nhập chiết khấu' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="Ví dụ: 10"
                  size="large"
                  className="w-full rounded-lg"
                  suffix="%"
                />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Form.Item
                name={`${prefix}VolumeMinQty2`}
                label="Số lượng từ"
              >
                <InputNumber
                  min={1}
                  placeholder="Ví dụ: 20 (tùy chọn)"
                  size="large"
                  className="w-full rounded-lg"
                />
              </Form.Item>
              <Form.Item
                name={`${prefix}VolumeDiscount2`}
                label="Giảm %"
              >
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="Ví dụ: 15 (tùy chọn)"
                  size="large"
                  className="w-full rounded-lg"
                  suffix="%"
                />
              </Form.Item>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DiscountTypeSelector;
