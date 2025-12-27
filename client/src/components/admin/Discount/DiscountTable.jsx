import { Table, Tag, Button, Space, Tooltip, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, TagOutlined } from '@ant-design/icons';
import {
  formatDateShort,
  getStatusVariant,
  getStatusText,
  getDiscountTypeText,
} from '../../../utils/discountHelpers';

const { Text } = Typography;

// Map status colors for Ant Design Tags
const getStatusColor = (status) => {
  const colors = {
    success: 'success',
    warning: 'warning',
    error: 'error',
    default: 'default',
  };
  return colors[getStatusVariant(status)] || 'default';
};

const DiscountTable = ({ discounts, loading, onSort, onView, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã giảm giá',
      dataIndex: 'code',
      key: 'code',
      sorter: true,
      render: (code) => <Text strong>{code}</Text>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: true,
      },
      render: (description) => description || '-',
    },
    {
      title: 'Giá trị',
      key: 'value',
      render: (_, record) => (
        <Text strong>{getDiscountTypeText(record)}</Text>
      ),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: true,
      render: (startDate) => formatDateShort(startDate),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (endDate) => endDate ? formatDateShort(endDate) : 'Không giới hạn',
    },
    {
      title: 'Lượt dùng',
      dataIndex: 'usageCount',
      key: 'usageCount',
      sorter: true,
      render: (usageCount) => usageCount || 0,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title={record.usageCount > 0 ? 'Không thể xóa mã đã sử dụng' : 'Xóa'}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
              disabled={record.usageCount > 0}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.field) {
      onSort(sorter.field);
    }
  };

  return (
    <Table
      columns={columns}
      dataSource={discounts}
      loading={loading}
      rowKey="id"
      onChange={handleTableChange}
      pagination={{
        pageSize: 10,
        showTotal: (total) => `Tổng ${total} mã giảm giá`,
      }}
      locale={{
        emptyText: (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <TagOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 16 }} />
            <div style={{ fontWeight: 500 }}>Không tìm thấy mã giảm giá nào</div>
          </div>
        ),
      }}
    />
  );
};

export default DiscountTable;

