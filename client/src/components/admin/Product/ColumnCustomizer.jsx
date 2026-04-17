import { Button, Drawer, Checkbox, Space, Divider, Tooltip } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useState } from 'react';

const ColumnCustomizer = ({ visibleColumns, onColumnsChange }) => {
  const [open, setOpen] = useState(false);

  const allColumns = [
    { key: 'select', label: 'Chọn' },
    { key: 'product', label: 'Sản phẩm' },
    { key: 'sku', label: 'SKU' },
    { key: 'category', label: 'Danh mục' },
    { key: 'price', label: 'Giá' },
    { key: 'stock', label: 'Tồn kho' },
    { key: 'sold', label: 'Đã bán' },
    { key: 'rating', label: 'Đánh giá' },
    { key: 'status', label: 'Trạng thái' },
    { key: 'createdAt', label: 'Ngày tạo' },
    { key: 'variants', label: 'Biến thể' },
    { key: 'actions', label: 'Thao tác' },
  ];

  const handleToggleColumn = (key) => {
    const updated = visibleColumns.includes(key)
      ? visibleColumns.filter(k => k !== key)
      : [...visibleColumns, key];

    const mandatoryColumns = ['select', 'product', 'actions'];
    const filtered = updated.filter(k => !mandatoryColumns.includes(k));
    onColumnsChange([...mandatoryColumns, ...filtered]);
  };

  const handleResetColumns = () => {

    onColumnsChange([
      'select',
      'product',
      'sku',
      'category',
      'price',
      'stock',
      'sold',
      'rating',
      'status',
      'createdAt',
      'variants',
      'actions',
    ]);
  };

  return (
    <>
      <Tooltip title="Tùy chỉnh cột">
        <Button
          type="default"
          icon={<SettingOutlined />}
          size="large"
          onClick={() => setOpen(true)}
          className="border-gray-300"
        />
      </Tooltip>

      <Drawer
        title="Tùy chỉnh cột hiển thị"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Chọn các cột bạn muốn hiển thị trên bảng:
            </p>
            <Space direction="vertical" className="w-full">
              {allColumns.map((col) => {
                const isDisabled =
                  ['select', 'product', 'actions'].includes(col.key);
                return (
                  <label
                    key={col.key}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <Checkbox
                      checked={visibleColumns.includes(col.key)}
                      onChange={() => handleToggleColumn(col.key)}
                      disabled={isDisabled}
                    />
                    <span className={isDisabled ? 'text-gray-400' : ''}>
                      {col.label}
                      {isDisabled && (
                        <span className="text-xs text-gray-400 ml-2">
                          (Bắt buộc)
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </Space>
          </div>

          <Divider />

          <Button
            type="dashed"
            block
            onClick={handleResetColumns}
            size="large"
          >
            Đặt lại về mặc định
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default ColumnCustomizer;






