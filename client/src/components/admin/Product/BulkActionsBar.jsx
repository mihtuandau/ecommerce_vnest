import { Button, Space, Select, Tag, Tooltip, Popconfirm, Modal } from 'antd';
import {
  DeleteOutlined,
  CloseOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';

const { Option } = Select;

const BulkActionsBar = ({
  selectedCount = 0,
  onBulkDelete,
  onBulkStatusChange,
  onExport,
  onClearSelection,
  deleting = false,
}) => {
  if (selectedCount === 0) return null;

  const handleStatusChange = (status) => {
    Modal.confirm({
      title: 'Thay đổi trạng thái',
      content: `Bạn có chắc muốn thay đổi trạng thái của ${selectedCount} sản phẩm thành "${status === 'active' ? 'Đang bán' : 'Ngừng bán'}"?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => onBulkStatusChange?.(status),
    });
  };

  return (
    <div className="sticky top-0 z-20 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Tag color="blue" className="text-sm font-medium px-3 py-1">
            {selectedCount} sản phẩm được chọn
          </Tag>
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={onClearSelection}
            className="text-gray-600 hover:text-gray-900"
          >
            Bỏ chọn
          </Button>
        </div>

        <Space size="middle" className="flex-wrap">
          {}
          <Tooltip title="Thay đổi trạng thái sản phẩm">
            <Select
              placeholder="Thay đổi trạng thái..."
              style={{ width: 160 }}
              onChange={handleStatusChange}
              size="large"
            >
              <Option value="active">Đang bán</Option>
              <Option value="inactive">Ngừng bán</Option>
            </Select>
          </Tooltip>

          {}
          <Tooltip title="Xuất danh sách sản phẩm được chọn">
            <Button
              type="default"
              icon={<FileExcelOutlined />}
              size="large"
              onClick={onExport}
            >
              Xuất Excel
            </Button>
          </Tooltip>

          {}
          <Popconfirm
            title="Xóa sản phẩm"
            description={`Bạn có chắc muốn xóa ${selectedCount} sản phẩm? Hành động này không thể hoàn tác.`}
            onConfirm={onBulkDelete}
            okText="Xóa"
            okButtonProps={{ danger: true, loading: deleting }}
            cancelText="Hủy"
          >
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              size="large"
              loading={deleting}
            >
              Xóa ({selectedCount})
            </Button>
          </Popconfirm>
        </Space>
      </div>
    </div>
  );
};

export default BulkActionsBar;






